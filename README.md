# 🏰 Bastion Brotherhood

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?logo=go)](https://golang.org)
[![Vue Version](https://img.shields.io/badge/Vue-3.5+-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript)](https://www.typescriptlang.org)

_一个现代化的人员管理系统，提供流畅的用户体验和强大的后端功能_

[🚀 在线演示](https://jshub.cn) · [📖 文档](docs/) · [🐛 报告问题](issues/) · [💡 功能请求](issues/)

</div>

---

## ✨ 功能特性

### 🎯 核心功能

- **👥 人员管理** - 完整的 CRUD 操作，支持头像上传
- **🔍 智能搜索** - 实时搜索和过滤功能
- **📱 响应式设计** - 完美适配桌面和移动设备
- **🌙 主题切换** - 支持明暗主题切换
- **⚡ 高性能** - 基于现代技术栈，快速响应

### 🛠️ 技术亮点

- **类型安全** - 全栈 TypeScript 开发
- **现代动画** - 流畅的 UI 动画和过渡效果
- **状态管理** - 基于 Pinia 的响应式状态管理
- **表单验证** - 强大的表单验证和错误处理
- **文件上传** - 支持头像上传和 MinIO 对象存储

---

## 🏗️ 技术架构

### 🎨 前端技术栈

| 技术                                         | 版本      | 用途                  |
| -------------------------------------------- | --------- | --------------------- |
| [Vue 3](https://vuejs.org)                   | `^3.5.17` | 渐进式前端框架        |
| [TypeScript](https://www.typescriptlang.org) | `^5.8`    | 类型安全的 JavaScript |
| [Vite](https://vitejs.dev)                   | `^7.0`    | 下一代前端构建工具    |
| [Tailwind CSS](https://tailwindcss.com)      | `^4.1.11` | 原子化 CSS 框架       |
| [Motion-v](https://motion-v.motionone.org)   | `^1.4.0`  | 高性能动画库          |
| [Pinia](https://pinia.vuejs.org)             | `^3.0.3`  | Vue 状态管理库        |
| [Reka UI](https://reka-ui.com)               | `^2.3.2`  | 无样式组件库          |
| [Shadcn-vue](https://shadcn-vue.com)         | `^1.0.0`  | 基于 Reka UI 的组件库 |

### ⚙️ 后端技术栈

| 技术                                               | 版本      | 用途             |
| -------------------------------------------------- | --------- | ---------------- |
| [Go](https://golang.org)                           | `1.21+`   | 高性能后端语言   |
| [Gin](https://github.com/gin-gonic/gin)            | `^1.9.1`  | 轻量级 Web 框架  |
| [GORM](https://gorm.io)                            | `^1.30.0` | ORM 库           |
| [SQLite](https://sqlite.org)                       | `^1.5.4`  | 嵌入式数据库     |
| [MinIO](https://min.io)                            | `^6.0.57` | 对象存储服务     |
| [Zap](https://github.com/uber-go/zap)              | `^1.27.0` | 结构化日志库     |
| [Snowflake](https://github.com/bwmarrin/snowflake) | `^0.3.0`  | 分布式 ID 生成器 |

---

## 🚀 快速开始

### 📋 前置要求

- **Go** 1.21 或更高版本
- **Node.js** 22 或更高版本
- **pnpm** 推荐的包管理器

### 🔧 安装与配置

1. **克隆仓库**

   ```bash
   git clone https://github.com/your-username/bastion-brotherhood.git
   cd bastion-brotherhood
   ```

2. **后端配置**

   ```bash
   cd server
   go mod download
   cp config/config.yaml.example config/config.yaml
   # 根据需要修改配置文件
   ```

3. **前端配置**
   ```bash
   cd frontend
   # 安装依赖
   pnpm install
   # 配置环境变量
   cp .env.development .env.development.local
   ```

### 🏃‍♂️ 运行项目

#### 开发环境

**启动后端服务：**

```bash
cd server
go run main.go
```

**启动前端开发服务器：**

```bash
cd frontend
pnpm dev
```

#### 生产环境

**构建前端：**

```bash
cd frontend
pnpm build
# 如果你希望跳过类型检查
pnpm build-only
```

**部署脚本：**

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📁 项目结构

```
bastion-brotherhood/
├── 📄 README.md                    # 项目说明文档
├── 📄 API.md                       # API接口文档
├── 📄 CHANGELOG.md                 # 更新日志
├── 📄 DEPLOY.md                    # 部署指南
├── 🔧 deploy.sh                    # 部署脚本
├── 🎨 frontend/                    # 前端项目
│   ├── 📦 package.json
│   ├── ⚙️ vite.config.ts
│   ├── 📝 tsconfig.json
│   └── 📂 src/
│       ├── 🎯 main.ts              # 入口文件
│       ├── 📱 App.vue              # 根组件
│       ├── 🎨 assets/              # 静态资源
│       ├── 🧩 components/          # 可复用组件
│       ├── 🪝 hooks/               # 自定义Hook
│       ├── 🗂️ layout/              # 布局组件
│       ├── 🌐 network/             # 网络请求
│       ├── 🧭 router/              # 路由配置
│       ├── 🗃️ store/               # 状态管理
│       ├── 📄 views/               # 页面组件
│       └── 🛠️ utils/               # 工具函数
└── ⚙️ server/                     # 后端项目
    ├── 📋 go.mod                   # Go模块文件
    ├── 🎯 main.go                  # 入口文件
    ├── ⚙️ config/                  # 配置文件
    ├── 🎮 controllers/             # 控制器
    ├── 🗄️ database/               # 数据库配置
    ├── 📝 log/                     # 日志模块
    ├── 🔧 middleware/              # 中间件
    ├── 📊 models/                  # 数据模型
    └── 🛣️ routes/                 # 路由配置
```

---

## 🔌 API 接口

### 👥 人员管理接口

| 方法     | 端点               | 描述             | 请求体     |
| -------- | ------------------ | ---------------- | ---------- |
| `GET`    | `/api/persons`     | 获取人员列表     | -          |
| `GET`    | `/api/persons/:id` | 获取单个人员信息 | -          |
| `POST`   | `/api/persons`     | 创建新人员       | `FormData` |
| `PUT`    | `/api/persons/:id` | 更新人员信息     | `FormData` |
| `DELETE` | `/api/persons/:id` | 删除人员         | -          |

### 📝 请求示例

#### 创建人员

```bash
curl -X POST http://localhost:8080/api/persons \
  -F "name=张三" \
  -F "realname=张三" \
  -F "phone=13800138000" \
  -F "email=zhangsan@example.com" \
  -F "avatar=@/path/to/avatar.jpg"
```

#### 获取人员列表

```bash
curl -X GET http://localhost:8080/api/persons
```

---

## 📊 数据库设计

### 👤 人员表 (persons)

| 字段          | 类型       | 说明                | 约束        |
| ------------- | ---------- | ------------------- | ----------- |
| `id`          | `string`   | 主键 ID (Snowflake) | PRIMARY KEY |
| `name`        | `string`   | 用户名              | NOT NULL    |
| `realname`    | `string`   | 真实姓名            | NOT NULL    |
| `avatar_blob` | `blob`     | 头像数据            | -           |
| `phone`       | `string`   | 手机号              | UNIQUE      |
| `wechat`      | `string`   | 微信号              | -           |
| `position`    | `string`   | 职位                | -           |
| `email`       | `string`   | 邮箱地址            | UNIQUE      |
| `region`      | `string`   | 地区                | -           |
| `created_at`  | `datetime` | 创建时间            | AUTO        |
| `updated_at`  | `datetime` | 更新时间            | AUTO        |
| `deleted_at`  | `datetime` | 删除时间            | SOFT DELETE |

---

## 🛡️ 安全特性

- **🔒 数据验证** - 前后端双重数据验证
- **🚫 SQL 注入防护** - 使用 GORM 预编译语句
- **📁 文件上传安全** - 文件类型和大小限制
- **🌐 CORS 配置** - 跨域请求安全控制
- **📝 日志记录** - 完整的操作日志记录

---

## 🔧 配置说明

### 后端配置 (`server/config/config.yaml`)

```yaml
server:
  port: 8080
  mode: debug

database:
  type: sqlite
  path: ./data/persons.db

minio:
  endpoint: localhost:9000
  access_key: minioadmin
  secret_key: minioadmin
  bucket: avatars

log:
  level: info
  filename: ./log/app.log
  max_size: 10
  max_backups: 5
  max_age: 30
```

### 前端环境变量 (`frontend/.env.*`)

```env
VITE_API_BASE_URL=/api
VITE_API_SERVER_URL=http://localhost:8080
VITE_PROJECT_NAME=Bastion Brotherhood
```

---

## 🧪 测试

### 前端测试

```bash
cd frontend
pnpm test:unit        # 运行单元测试
pnpm lint             # 代码规范检查
pnpm type-check       # TypeScript类型检查
```

### 后端测试

```bash
cd server
go test ./...         # 运行所有测试
go test -v ./...      # 详细测试输出
```

---

## 📈 性能优化

- **⚡ 前端优化**

  - Vite 构建优化和代码分割
  - 组件懒加载和动态导入
  - 图片压缩和延迟加载
  - CSS 原子化和按需加载

- **🚀 后端优化**
  - GORM 查询优化和连接池
  - 响应数据压缩
  - 静态文件缓存
  - 数据库索引优化

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 🙏 致谢

- [Vue.js](https://vuejs.org) - 渐进式 JavaScript 框架
- [Go](https://golang.org) - 简洁高效的编程语言
- [Tailwind CSS](https://tailwindcss.com) - 实用优先的 CSS 框架
- [Gin](https://github.com/gin-gonic/gin) - 高性能 Go Web 框架

---

<div align="center">

Made with ❤️ by the Bastion Brotherhood Team

欢迎来到不朽堡垒

</div>
