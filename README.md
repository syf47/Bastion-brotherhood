# 用户管理系统

这是一个基于Gin框架的用户增删改查后端系统，配合Vue3前端界面。

## 功能特性

- ✅ 用户增删改查（CRUD）
- ✅ 支持头像上传（FormData格式）
- ✅ 头像在用户列表中展示
- ✅ 现代化的Vue3前端界面
- ✅ 响应式设计，支持移动端
- ✅ 数据持久化存储在SQLite数据库

## 技术栈

### 后端
- Go 1.21+
- Gin Web框架
- GORM ORM
- SQLite数据库
- CORS支持

### 前端
- Vue 3
- Element Plus UI组件库
- Vite构建工具
- Axios HTTP客户端

## 项目结构

```
.
├── main.go                 # 后端入口文件
├── go.mod                  # Go模块依赖
├── models/                 # 数据模型
│   └── person.go
├── controllers/            # 控制器
│   └── person_controller.go
├── database/              # 数据库配置
│   └── database.go
├── routes/                # 路由配置
│   └── routes.go
├── data/                  # 数据目录
│   └── persons.db         # SQLite数据库
├── frontend/              # 前端项目
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── components/
│       │   └── PersonForm.vue
│       └── api/
│           └── person.js
└── README.md
```

## 安装和运行

### 后端运行

1. 确保已安装Go 1.21+
2. 初始化Go模块依赖：
   ```bash
   go mod tidy
   ```
3. 运行后端服务：
   ```bash
   go run main.go
   ```
4. 后端服务将在 `http://localhost:8080` 启动

### 前端运行

1. 进入前端目录：
   ```bash
   cd frontend
   ```
2. 安装依赖：
   ```bash
   npm install
   ```
3. 启动开发服务器：
   ```bash
   npm run dev
   ```
4. 前端应用将在 `http://localhost:3000` 启动

## API接口

### 用户相关接口

- `GET /api/persons` - 获取用户列表
- `GET /api/persons/:id` - 获取单个用户
- `POST /api/persons` - 创建用户（支持FormData文件上传）
- `PUT /api/persons/:id` - 更新用户（支持FormData文件上传）
- `DELETE /api/persons/:id` - 删除用户

### 请求示例

#### 创建用户（FormData）
```bash
curl -X POST http://localhost:8080/api/persons \
  -F "name=张三" \
  -F "realname=张三" \
  -F "phone=13800138000" \
  -F "email=zhangsan@example.com" \
  -F "avatar=@/path/to/avatar.jpg"
```

## 数据库结构

用户表（persons）字段：
- `id` - 主键ID
- `name` - 用户名
- `realname` - 真实姓名
- `avatar_blob` - 头像二进制数据
- `phone` - 手机号
- `wechat` - 微信号
- `position` - 职位
- `email` - 邮箱
- `region` - 地区
- `created_at` - 创建时间
- `updated_at` - 更新时间
- `deleted_at` - 删除时间（软删除）

## 开发说明

- 后端使用GORM进行数据库操作，支持软删除
- 头像以BLOB格式存储在数据库中，返回给前端时转换为base64格式
- 前端使用Element Plus组件库，提供现代化的UI体验
- 支持跨域请求，前后端分离开发
- 使用Vite作为前端构建工具，开发体验更佳

## 注意事项

1. 确保SQLite数据库文件 `data/persons.db` 存在且有正确的表结构
2. 头像文件大小建议不超过2MB
3. 支持的头像格式：jpg, jpeg, png, gif
4. 前端代理配置已设置，开发时可直接调用后端API 