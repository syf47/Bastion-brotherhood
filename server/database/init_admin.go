package database

import (
	"bastion-brotherhood/models"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// InitAdminUser 初始化管理员用户
func InitAdminUser() {
	// 检查是否已存在管理员用户
	var adminUser models.User
	result := DB.Where("username = ?", "admin").First(&adminUser)
	
	if result.Error == nil {
		log.Println("Admin user already exists")
		return
	}

	// 创建默认管理员用户
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash admin password: %v", err)
		return
	}

	adminUser = models.User{
		Username:  "admin",
		Password:  string(hashedPassword),
		RealName:  "系统管理员",
		Email:     "admin@example.com",
		Role:      "admin",
		Status:    "active",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := DB.Create(&adminUser).Error; err != nil {
		log.Printf("Failed to create admin user: %v", err)
		return
	}

	log.Println("Admin user created successfully: username=admin, password=admin123")
}

// InitDefaultUsers 初始化默认用户（可选）
func InitDefaultUsers() {
	// 检查是否已存在默认用户
	var count int64
	DB.Model(&models.User{}).Count(&count)
	
	if count > 1 { // 如果已经有其他用户，跳过
		return
	}

	// 创建默认普通用户
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("user123"), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Failed to hash default user password: %v", err)
		return
	}

	defaultUser := models.User{
		Username:  "user",
		Password:  string(hashedPassword),
		RealName:  "普通用户",
		Email:     "user@example.com",
		Role:      "user",
		Status:    "active",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := DB.Create(&defaultUser).Error; err != nil {
		log.Printf("Failed to create default user: %v", err)
		return
	}

	log.Println("Default user created successfully: username=user, password=user123")
}
