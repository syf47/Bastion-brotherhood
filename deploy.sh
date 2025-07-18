#!/bin/bash

# 部署脚本 - 用户管理系统 (后端 + 前端)
set -e

# 服务器配置
SERVER_HOST="49.233.41.155"
SERVER_USER="root"
SERVER_PATH="/opt/gin-web-server"
BINARY_NAME="gin-web-server"
FRONTEND_PATH="/var/www/gin-web-server"

# 检查必要工具
echo "检查必要工具"
command -v go >/dev/null 2>&1 || { echo "Go 未安装"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "npm 未安装"; exit 1; }

# 构建后端
echo "构建后端应用程序..."
export CGO_ENABLED=0
export GOOS=linux
export GOARCH=amd64

# 安装Go依赖
echo "安装Go依赖..."
go mod tidy

# 构建后端二进制文件
echo "编译后端应用程序..."
go build -ldflags="-s -w" -o ${BINARY_NAME} main.go

if [ ! -f "${BINARY_NAME}" ]; then
    echo "后端构建失败"
    exit 1
fi

echo "后端构建成功"

# 构建前端
echo "构建前端应用程序..."
cd frontend

# 安装前端依赖
echo "安装前端依赖..."
npm install

# 构建前端
echo "编译前端应用程序..."
npm run build:vite

if [ ! -d "dist" ]; then
    echo "前端构建失败"
    exit 1
fi

echo "前端构建成功"
cd ..

# 上传到服务器
echo "上传文件到服务器..."

# 停止现有服务
echo "停止现有服务..."
ssh ${SERVER_USER}@${SERVER_HOST} "systemctl stop gin-web-server || true"

# 清理旧数据
echo "清理服务器旧数据..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDCLEAN'
    # 清理旧的静态文件
    rm -rf /opt/gin-web-server/static
    rm -rf /opt/gin-web-server/templates
    rm -rf /opt/gin-web-server/uploads
    
    # 清理旧的数据库（如果需要保留数据，请注释掉下面这行）
    # rm -f /opt/gin-web-server/data/*.db
    
    # 清理旧的前端文件
    rm -rf /var/www/gin-web-server/*
    
    # 清理旧的源码
    rm -rf /opt/gin-web-server/src
ENDCLEAN

# 创建目录
echo "创建服务器目录..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${FRONTEND_PATH}"
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/data"

# 上传后端二进制文件
echo "上传后端文件..."
scp ${BINARY_NAME} ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

## 上传前端文件
#echo "上传前端文件..."
#scp -r frontend/dist/* ${SERVER_USER}@${SERVER_HOST}:${FRONTEND_PATH}/

# 创建systemd服务文件
echo "创建systemd服务文件..."
cat > gin-web-server.service << EOF
[Unit]
Description=Gin Web Server Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${SERVER_PATH}
ExecStart=${SERVER_PATH}/${BINARY_NAME}
Restart=always
RestartSec=5
Environment=GIN_MODE=release

[Install]
WantedBy=multi-user.target
EOF

# 上传systemd服务文件
scp gin-web-server.service ${SERVER_USER}@${SERVER_HOST}:/etc/systemd/system/

# 创建Nginx配置文件
echo "创建Nginx配置文件..."
cat > nginx-gin-web-server.conf << EOF
server {
    listen 80;
    server_name ${SERVER_HOST};
    
    # 前端静态文件
    location / {
        root ${FRONTEND_PATH};
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # 后端API
    location /api/ {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root ${FRONTEND_PATH};
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 上传Nginx配置
echo "上传Nginx配置文件..."
scp nginx-gin-web-server.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/

# 服务器端配置
echo "配置服务器..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    # 设置权限
    chmod +x /opt/gin-web-server/gin-web-server
    
    # 检测Nginx配置目录并移动配置文件
    if [ -d "/etc/nginx/sites-available" ]; then
        # Ubuntu/Debian 系统
        mv /tmp/nginx-gin-web-server.conf /etc/nginx/sites-available/gin-web-server
        rm -f /etc/nginx/sites-enabled/gin-web-server
        rm -f /etc/nginx/sites-enabled/gin-name-list
        ln -sf /etc/nginx/sites-available/gin-web-server /etc/nginx/sites-enabled/
    elif [ -d "/etc/nginx/conf.d" ]; then
        # CentOS/RHEL 系统
        mv /tmp/nginx-gin-web-server.conf /etc/nginx/conf.d/gin-web-server.conf
        rm -f /etc/nginx/conf.d/gin-name-list.conf
    else
        # 其他系统，直接放到nginx目录
        mv /tmp/nginx-gin-web-server.conf /etc/nginx/gin-web-server.conf
        echo "include /etc/nginx/gin-web-server.conf;" >> /etc/nginx/nginx.conf
    fi
    
    # 测试Nginx配置
    nginx -t && systemctl reload nginx
    
    # 重新加载systemd并启动服务
    systemctl daemon-reload
    systemctl enable gin-web-server
    systemctl start gin-web-server
ENDSSH

# 检查服务状态
echo "检查服务状态..."
ssh ${SERVER_USER}@${SERVER_HOST} "systemctl status gin-web-server --no-pager"

echo "部署完成！"
echo "前端访问地址: http://${SERVER_HOST}"
echo "后端API地址: http://${SERVER_HOST}/api"

# 清理本地构建文件
echo "清理本地构建文件..."
rm -f ${BINARY_NAME}
rm -f gin-web-server.service
rm -f nginx-gin-web-server.conf
rm -rf frontend/dist

echo "部署成功！"
echo ""
echo "部署信息:"
echo "  - 后端服务: systemctl status gin-web-server"
echo "  - 前端文件: ${FRONTEND_PATH}"
echo "  - 后端文件: ${SERVER_PATH}"
echo "  - 日志查看: journalctl -u gin-web-server -f"