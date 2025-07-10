package database

import (
	"database/sql"
	"log"
	"bastion-brotherhood/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

var DB *gorm.DB

func InitDB() {
	var err error
	
	// 使用纯Go的SQLite驱动
	sqlDB, err := sql.Open("sqlite", "data/persons.db")
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	
	DB, err = gorm.Open(sqlite.Dialector{
		Conn: sqlDB,
	}, &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	
	// 自动迁移数据库表结构
	err = DB.AutoMigrate(&models.Person{})
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}
	
	log.Println("Database connected and migrated successfully")
} 