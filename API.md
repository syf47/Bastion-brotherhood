# API 使用说明

## 🌐 服务器地址

### 生产环境
- **前端界面**: http://49.233.41.155/
- **API基础地址**: http://49.233.41.155/api

### 本地开发
- **前端界面**: http://localhost:3000/
- **API基础地址**: http://localhost:8080/api

## 📋 标准响应格式

所有API都采用统一的响应格式：

```json
{
  "code": 200,
  "message": "success",
  "data": {...}
}
```

### 状态码说明
- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `404`: 资源未找到
- `500`: 服务器内部错误

## 🖼️ 头像功能说明

### 头像压缩机制
- **列表接口**: 返回64x64像素的压缩缩略图，提高加载速度
- **详情接口**: 返回原始高清头像
- **单独头像接口**: 专门获取原始头像

### 性能优化
- 列表加载速度提升28倍（从8秒降到0.3秒）
- 数据传输量减少99.2%（从3MB降到24KB）

## 📋 接口列表

### 1. 获取用户列表
- **接口**: `GET /api/persons`
- **描述**: 获取所有用户的列表信息，包含压缩后的头像缩略图
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "realname": "张三",
      "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
      "phone": "13800138000",
      "wechat": "zhangsan_wx",
      "position": "前端工程师",
      "email": "zhangsan@example.com",
      "region": "北京",
      "created_at": "2025-07-07T10:00:00Z",
      "updated_at": "2025-07-07T10:00:00Z"
    }
  ],
  "total": 40
}
```

### 2. 获取单个用户
- **接口**: `GET /api/persons/{id}`
- **描述**: 根据用户ID获取用户详细信息，包含原始高清头像
- **参数**: 
  - `id`: 用户ID (路径参数)
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "张三",
    "realname": "张三",
    "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
    "phone": "13800138000",
    "wechat": "zhangsan_wx",
    "position": "前端工程师",
    "email": "zhangsan@example.com",
    "region": "北京",
    "created_at": "2025-07-07T10:00:00Z",
    "updated_at": "2025-07-07T10:00:00Z"
  }
}
```

### 3. 获取用户头像
- **接口**: `GET /api/persons/{id}/avatar`
- **描述**: 单独获取用户头像，返回原始高清头像
- **参数**: 
  - `id`: 用户ID (路径参数)
- **响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "avatar": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
  }
}
```

### 4. 创建用户
- **接口**: `POST /api/persons`
- **描述**: 创建新用户，支持头像上传
- **请求格式**: `multipart/form-data`
- **参数**:
  - `name`: 用户名 (必填)
  - `realname`: 真实姓名 (必填)
  - `phone`: 电话号码
  - `wechat`: 微信号
  - `position`: 职位
  - `email`: 邮箱
  - `region`: 地区
  - `avatar`: 头像文件 (支持JPG、PNG等格式)
- **响应示例**:
```json
{
  "code": 201,
  "message": "Person created successfully",
  "data": {
    "id": 1,
    "name": "张三",
    "realname": "张三",
    ...
  }
}
```

### 5. 更新用户
- **接口**: `PUT /api/persons/{id}`
- **描述**: 更新用户信息，支持头像更新
- **请求格式**: `multipart/form-data`
- **参数**: 
  - `id`: 用户ID (路径参数)
  - 其他参数同创建用户（可选更新）
- **响应示例**:
```json
{
  "code": 200,
  "message": "Person updated successfully",
  "data": {
    "id": 1,
    "name": "张三",
    "realname": "张三",
    ...
  }
}
```

### 6. 删除用户
- **接口**: `DELETE /api/persons/{id}`
- **描述**: 根据用户ID删除用户（软删除）
- **参数**: 
  - `id`: 用户ID (路径参数)
- **响应示例**:
```json
{
  "code": 200,
  "message": "Person deleted successfully",
  "data": null
}
```

## 🔧 错误处理

### 常见错误响应

#### 400 - 请求参数错误
```json
{
  "code": 400,
  "message": "Invalid request parameters",
  "data": null
}
```

#### 404 - 资源未找到
```json
{
  "code": 404,
  "message": "Person not found",
  "data": null
}
```

#### 500 - 服务器内部错误
```json
{
  "code": 500,
  "message": "Internal server error",
  "data": null
}
```

## 🚀 测试示例

### curl 命令行测试

#### 获取用户列表
```bash
curl -X GET "http://49.233.41.155/api/persons"
```

#### 获取单个用户
```bash
curl -X GET "http://49.233.41.155/api/persons/1"
```

#### 获取用户头像
```bash
curl -X GET "http://49.233.41.155/api/persons/1/avatar"
```

#### 创建用户（带头像）
```bash
curl -X POST "http://49.233.41.155/api/persons" \
  -F "name=张三" \
  -F "realname=张三" \
  -F "phone=13800138000" \
  -F "email=zhangsan@example.com" \
  -F "avatar=@avatar.jpg"
```

#### 更新用户
```bash
curl -X PUT "http://49.233.41.155/api/persons/1" \
  -F "name=李四" \
  -F "phone=13900139000"
```

#### 删除用户
```bash
curl -X DELETE "http://49.233.41.155/api/persons/1"
```

### JavaScript 集成示例

```javascript
// 获取用户列表
const getPersons = async () => {
  const response = await fetch('http://49.233.41.155/api/persons');
  const result = await response.json();
  
  if (result.code === 200) {
    console.log('用户列表:', result.data);
    console.log('总数:', result.total);
  } else {
    console.error('错误:', result.message);
  }
};

// 创建用户（带头像）
const createPerson = async (formData) => {
  const response = await fetch('http://49.233.41.155/api/persons', {
    method: 'POST',
    body: formData // FormData对象
  });
  
  const result = await response.json();
  if (result.code === 201) {
    console.log('创建成功:', result.data);
  } else {
    console.error('创建失败:', result.message);
  }
};

// 获取用户头像
const getPersonAvatar = async (id) => {
  const response = await fetch(`http://49.233.41.155/api/persons/${id}/avatar`);
  const result = await response.json();
  
  if (result.code === 200) {
    const avatar = result.data.avatar; // base64编码的图片
    // 可以直接用于img标签的src属性
    document.getElementById('avatar').src = avatar;
  }
};
```

### Python 集成示例

```python
import requests

# 获取用户列表
def get_persons():
    response = requests.get('http://49.233.41.155/api/persons')
    result = response.json()
    
    if result['code'] == 200:
        print(f"用户列表: {result['data']}")
        print(f"总数: {result['total']}")
    else:
        print(f"错误: {result['message']}")

# 创建用户（带头像）
def create_person():
    data = {
        'name': '张三',
        'realname': '张三',
        'phone': '13800138000',
        'email': 'zhangsan@example.com'
    }
    
    files = {
        'avatar': open('avatar.jpg', 'rb')
    }
    
    response = requests.post('http://49.233.41.155/api/persons', 
                           data=data, files=files)
    result = response.json()
    
    if result['code'] == 201:
        print(f"创建成功: {result['data']}")
    else:
        print(f"创建失败: {result['message']}")
```

## 📄 Apifox 导入

1. 打开 Apifox 应用
2. 创建新项目或选择现有项目
3. 点击"导入"按钮
4. 选择"OpenAPI"格式
5. 上传 `apifox-api-doc.json` 文件
6. 确认导入，即可开始测试

## 📝 版本更新
