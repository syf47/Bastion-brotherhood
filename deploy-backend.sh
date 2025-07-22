#!/bin/bash

# 部署脚本 - 用户管理系统 (仅后端)
set -e

cd server
# 服务器配置
SERVER_HOST="49.233.41.155"
SERVER_USER="root"
SERVER_PATH="/opt/gin-web-server"
BINARY_NAME="gin-web-server"

# 检查必要工具
echo "检查必要工具"
command -v go >/dev/null 2>&1 || { echo "Go 未安装"; exit 1; }

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

# 上传到服务器
echo "上传文件到服务器..."

# 停止现有服务
echo "停止现有服务..."
ssh ${SERVER_USER}@${SERVER_HOST} "systemctl stop gin-web-server || true"

# 清理旧的后端数据
echo "清理服务器旧的后端数据..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDCLEAN'
    # 清理旧的静态文件
    rm -rf /opt/gin-web-server/static
    rm -rf /opt/gin-web-server/templates
    rm -rf /opt/gin-web-server/uploads
    
    # 清理旧的数据库（如果需要保留数据，请注释掉下面这行）
    # rm -f /opt/gin-web-server/data/*.db
    
    # 清理旧的源码
    rm -rf /opt/gin-web-server/src
ENDCLEAN

# 创建目录
echo "创建服务器目录..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}"
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/data"

# 上传后端二进制文件
echo "上传后端文件..."
scp ${BINARY_NAME} ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

# 上传配置文件
echo "上传配置文件..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/config"
scp config/config.yaml ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/config/

# 上传静态资源文件
echo "上传静态资源文件..."
ssh ${SERVER_USER}@${SERVER_HOST} "mkdir -p ${SERVER_PATH}/assets"
scp -r assets/* ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/assets/ || echo "没有找到assets目录，跳过"



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

# 服务器端配置
echo "配置服务器..."
ssh ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
    # 设置权限
    chmod +x /opt/gin-web-server/gin-web-server
    
    # 重新加载systemd并启动服务
    systemctl daemon-reload
    systemctl enable gin-web-server
    systemctl start gin-web-server
ENDSSH

# 检查服务状态
echo "检查服务状态..."
ssh ${SERVER_USER}@${SERVER_HOST} "systemctl status gin-web-server --no-pager"

echo "后端部署完成！"
echo "后端API地址: http://${SERVER_HOST}:8080"

# 清理本地构建文件
echo "清理本地构建文件..."
rm -f ${BINARY_NAME}
rm -f gin-web-server.service

echo "后端部署成功！"
echo ""
echo "部署信息:"
echo "  - 后端服务: systemctl status gin-web-server"
echo "  - 后端文件: ${SERVER_PATH}"
echo "  - 日志查看: journalctl -u gin-web-server -f"
echo "  - 服务管理: systemctl start/stop/restart gin-web-server" 