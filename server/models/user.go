package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	Username  string         `json:"username" gorm:"uniqueIndex;not null"`
	Password  string         `json:"-" gorm:"not null"` // 密码不返回给前端
	RealName  string         `json:"realname" gorm:"column:realname;not null"`
	Email     string         `json:"email"`
	Phone     string         `json:"phone"`
	Role      string         `json:"role" gorm:"default:'user'"` // 用户角色：admin, user
	Status    string         `json:"status" gorm:"default:'active'"` // 用户状态：active, inactive, banned
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// UserResponse 用于返回给前端的用户信息（不包含密码）
type UserResponse struct {
	ID        uint      `json:"id"`
	Username  string    `json:"username"`
	RealName  string    `json:"realname"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// LoginRequest 登录请求结构
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应结构
type LoginResponse struct {
	Token string       `json:"token"`
	User  UserResponse `json:"user"`
}

func (User) TableName() string {
	return "users"
}
