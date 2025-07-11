-- 人员信息表建表语句
-- 根据 models/person.go 中的 Person 结构体生成

CREATE TABLE IF NOT EXISTS `persons` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    `name` VARCHAR(255) NOT NULL COMMENT '用户名',
    `realname` VARCHAR(255) NOT NULL COMMENT '真实姓名',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL地址',
    `avatar_blob` LONGBLOB DEFAULT NULL COMMENT '头像二进制数据',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `wechat` VARCHAR(100) DEFAULT NULL COMMENT '微信号',
    `position` VARCHAR(100) DEFAULT NULL COMMENT '职位',
    `email` VARCHAR(255) DEFAULT NULL COMMENT '邮箱',
    `region` VARCHAR(100) DEFAULT NULL COMMENT '地区',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间（软删除）',
    INDEX `idx_deleted_at` (`deleted_at`),
    INDEX `idx_name` (`name`),
    INDEX `idx_phone` (`phone`),
    INDEX `idx_email` (`email`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='人员信息表';

-- 添加表注释
ALTER TABLE `persons` COMMENT = '人员信息表 - 存储用户基本信息、头像等数据';

-- 可选：添加一些约束
-- ALTER TABLE `persons` ADD CONSTRAINT `uk_phone` UNIQUE (`phone`) WHERE `deleted_at` IS NULL;
-- ALTER TABLE `persons` ADD CONSTRAINT `uk_email` UNIQUE (`email`) WHERE `deleted_at` IS NULL;
