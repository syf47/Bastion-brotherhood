# 认证系统使用说明

## 概述

本项目已集成JWT认证系统，除了获取用户列表接口外，其他所有接口都需要有效的JWT token才能访问。

## 默认用户

系统启动时会自动创建以下默认用户：

### 管理员用户
- 用户名: `admin`
- 密码: `admin123`
- 角色: `admin`

### 普通用户
- 用户名: `user`
- 密码: `user123`
- 角色: `user`

## API接口

### 无需认证的接口

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "password123",
  "realname": "新用户",
  "email": "user@example.com",
  "phone": "13800138000"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

响应示例：
```json
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "realname": "系统管理员",
      "email": "admin@example.com",
      "phone": "",
      "role": "admin",
      "status": "active",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 需要认证的接口

所有需要认证的接口都需要在请求头中包含JWT token：

```http
Authorization: Bearer <your-jwt-token>
```

#### 获取当前用户信息
```http
GET /api/users/profile
Authorization: Bearer <your-jwt-token>
```

#### 更新用户信息
```http
PUT /api/users/profile
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "realname": "新姓名",
  "email": "newemail@example.com",
  "phone": "13900139000"
}
```

#### 修改密码
```http
PUT /api/users/password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "old_password": "oldpassword",
  "new_password": "newpassword"
}
```

#### 人员管理接口（需要认证）
```http
# 获取人员列表
GET /api/persons
Authorization: Bearer <your-jwt-token>

# 创建人员
POST /api/persons
Authorization: Bearer <your-jwt-token>

# 更新人员
PUT /api/persons/:id
Authorization: Bearer <your-jwt-token>

# 删除人员
DELETE /api/persons/:id
Authorization: Bearer <your-jwt-token>

# 上传头像
POST /api/persons/:id/avatar
Authorization: Bearer <your-jwt-token>
```

## 前端使用示例

### 登录流程
1. 调用登录接口获取token
2. 将token存储到localStorage或sessionStorage
3. 在后续请求的请求头中添加token

```javascript
// 登录
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 存储token
localStorage.setItem('token', token);

// 后续请求使用token
const response = await fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 请求拦截器
建议在前端设置请求拦截器，自动添加token：

```javascript
// Axios拦截器示例
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器处理token过期
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      // token过期，跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 安全注意事项

1. **JWT密钥**: 生产环境中请修改配置文件中的JWT密钥
2. **HTTPS**: 生产环境建议使用HTTPS
3. **Token过期**: 默认token有效期为24小时
4. **密码安全**: 用户密码使用bcrypt加密存储
5. **CORS**: 已配置CORS，允许指定域名访问

## 配置说明

JWT相关配置在 `config/config.yaml` 文件中：

```yaml
jwt:
  secret_key: "your-super-secret-jwt-key-change-in-production"
  expire_hours: 24
```

- `secret_key`: JWT签名密钥，生产环境请修改
- `expire_hours`: token过期时间（小时）
