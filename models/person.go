package models

import (
	"time"
	"gorm.io/gorm"
)

type Person struct {
	ID         uint           `json:"id" gorm:"primaryKey"`
	Name       string         `json:"name" gorm:"not null"`
	RealName   string         `json:"realname" gorm:"column:realname;not null"`
	AvatarBlob []byte         `json:"-" gorm:"column:avatar_blob"`
	Phone      string         `json:"phone"`
	Wechat     string         `json:"wechat"`
	Position   string         `json:"position"`
	Email      string         `json:"email"`
	Region     string         `json:"region"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `json:"deleted_at" gorm:"index"`
}

// PersonResponse 用于返回给前端的结构体，包含头像的base64编码
type PersonResponse struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	RealName  string    `json:"realname"`
	Avatar    string    `json:"avatar"` // base64编码的头像
	Phone     string    `json:"phone"`
	Wechat    string    `json:"wechat"`
	Position  string    `json:"position"`
	Email     string    `json:"email"`
	Region    string    `json:"region"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (Person) TableName() string {
	return "persons"
} 