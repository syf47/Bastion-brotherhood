# 数据库初始化说明

## 功能概述

本模块提供了灵活的数据库初始化功能，支持MySQL和SQLite两种数据库。

## 配置说明

### 配置文件位置
`config/config.yaml`

### MySQL配置示例
```yaml
mysql:
  host: "127.0.0.1"          # MySQL服务器地址
  port: "3306"                # MySQL端口
  database: "bastion_brotherhood"  # 数据库名
  username: "root"            # 用户名
  password: "123456"          # 密码
  max_idle_conn: 10          # 最大空闲连接数
  max_open_conn: 100         # 最大打开连接数
  max_idle_time: 30          # 连接最大空闲时间(秒)
```

### SQLite配置
当MySQL配置中的host为空或为"127.0.0.1"时，系统会自动使用SQLite数据库。

## 使用方法

### 1. 基本初始化
```go
import "bastion-brotherhood/database"

func main() {
    // 初始化数据库（自动选择MySQL或SQLite）
    database.InitDB()
}
```

### 2. 测试MySQL连接
```go
import "bastion-brotherhood/database"

func testConnection() {
    err := database.TestMySQLConnection()
    if err != nil {
        log.Printf("MySQL连接测试失败: %v", err)
    } else {
        log.Println("MySQL连接测试成功")
    }
}
```

### 3. 关闭数据库连接
```go
import "bastion-brotherhood/database"

func cleanup() {
    database.CloseDB()
}
```

## 数据库选择逻辑

1. **MySQL模式**: 当配置文件中MySQL的host不为空且不等于"127.0.0.1"时
2. **SQLite模式**: 当MySQL配置为空或host为"127.0.0.1"时（默认模式）

## 连接池配置

### MySQL连接池参数
- `MaxIdleConns`: 最大空闲连接数
- `MaxOpenConns`: 最大打开连接数  
- `ConnMaxIdleTime`: 连接最大空闲时间

### 推荐配置
```yaml
mysql:
  max_idle_conn: 10      # 生产环境建议10-20
  max_open_conn: 100     # 生产环境建议100-200
  max_idle_time: 30      # 生产环境建议30-60秒
```

## 错误处理

### 常见错误及解决方案

1. **连接被拒绝**
   ```
   Error: failed to connect to MySQL: dial tcp 127.0.0.1:3306: connect: connection refused
   ```
   **解决方案**: 检查MySQL服务是否启动，端口是否正确

2. **认证失败**
   ```
   Error: failed to connect to MySQL: Access denied for user 'root'@'localhost'
   ```
   **解决方案**: 检查用户名和密码是否正确

3. **数据库不存在**
   ```
   Error: failed to connect to MySQL: Unknown database 'bastion_brotherhood'
   ```
   **解决方案**: 创建数据库
   ```sql
   CREATE DATABASE bastion_brotherhood CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

## 表结构自动迁移

系统会自动创建以下表结构：

### persons表
```sql
CREATE TABLE `persons` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `realname` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(500),
    `avatar_blob` LONGBLOB,
    `phone` VARCHAR(20),
    `wechat` VARCHAR(100),
    `position` VARCHAR(100),
    `email` VARCHAR(255),
    `region` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL DEFAULT NULL,
    INDEX `idx_deleted_at` (`deleted_at`),
    INDEX `idx_name` (`name`),
    INDEX `idx_phone` (`phone`),
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 部署建议

### 开发环境
- 使用SQLite（默认）
- 配置简单，无需额外安装

### 生产环境
- 使用MySQL
- 配置连接池参数
- 定期备份数据库
- 监控连接数和使用情况

## 注意事项

1. **字符集**: 使用utf8mb4以支持emoji和特殊字符
2. **时区**: 使用本地时区设置
3. **连接池**: 根据服务器性能调整连接池参数
4. **备份**: 定期备份数据库文件
5. **权限**: 确保数据库用户有足够的权限 