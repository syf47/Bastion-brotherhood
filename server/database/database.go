package database

import (
	"bastion-brotherhood/config"
	"bastion-brotherhood/models"
	"database/sql"
	"fmt"
	"log"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	_ "modernc.org/sqlite"
)

var DB *gorm.DB

// InitDB 初始化数据库连接
func InitDB() {
	var err error

	// 获取数据库配置
	dbConfig := config.GetGlobalConfig().DbConfig

	// 根据配置选择数据库类型
	if dbConfig.Host != "" && dbConfig.Host != "127.0.0.1" {
		// 使用MySQL数据库
		err = initMySQL(dbConfig)
	} else {
		// 使用SQLite数据库（默认）
		err = initSQLite()
	}

	if err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	log.Println("Database connected and migrated successfully")
}

// initMySQL 初始化MySQL数据库连接
func initMySQL(dbConfig *config.DbConfig) error {
	var err error

	// 构建MySQL连接字符串
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbConfig.Username,
		dbConfig.Password,
		dbConfig.Host,
		dbConfig.Port,
		dbConfig.Database,
	)

	// 连接MySQL数据库
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %v", err)
	}

	// 获取底层的sql.DB对象以设置连接池参数
	sqlDB, err := DB.DB()
	if err != nil {
		return fmt.Errorf("failed to get underlying sql.DB: %v", err)
	}

	// 设置连接池参数
	sqlDB.SetMaxIdleConns(dbConfig.MaxIdleConn)
	sqlDB.SetMaxOpenConns(dbConfig.MaxOpenConn)
	sqlDB.SetConnMaxIdleTime(time.Duration(dbConfig.MaxIdleTime) * time.Second)

	// 自动迁移数据库表结构
	err = DB.AutoMigrate(&models.Person{})
	if err != nil {
		return fmt.Errorf("failed to migrate MySQL database: %v", err)
	}

	log.Printf("MySQL database connected successfully to %s:%s/%s",
		dbConfig.Host, dbConfig.Port, dbConfig.Database)

	return nil
}

// initSQLite 初始化SQLite数据库连接
func initSQLite() error {
	var err error

	// 使用纯Go的SQLite驱动
	sqlDB, err := sql.Open("sqlite", "data/persons.db")
	if err != nil {
		return fmt.Errorf("failed to open SQLite database: %v", err)
	}

	DB, err = gorm.Open(sqlite.Dialector{
		Conn: sqlDB,
	}, &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to SQLite: %v", err)
	}

	// 自动迁移数据库表结构
	err = DB.AutoMigrate(&models.Person{})
	if err != nil {
		return fmt.Errorf("failed to migrate SQLite database: %v", err)
	}

	log.Println("SQLite database connected successfully")

	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}

// TestMySQLConnection 测试MySQL连接
func TestMySQLConnection() error {
	dbConfig := config.GetGlobalConfig().DbConfig

	// 构建MySQL连接字符串
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		dbConfig.Username,
		dbConfig.Password,
		dbConfig.Host,
		dbConfig.Port,
		dbConfig.Database,
	)

	// 测试连接
	testDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %v", err)
	}

	// 执行简单查询测试连接
	var result int
	err = testDB.Raw("SELECT 1").Scan(&result).Error
	if err != nil {
		return fmt.Errorf("failed to execute test query: %v", err)
	}

	log.Printf("MySQL connection test successful: %s:%s/%s",
		dbConfig.Host, dbConfig.Port, dbConfig.Database)

	return nil
}
