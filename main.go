package main

import (
	"log"
	"gin_name_list/database"
	"gin_name_list/routes"
)

func main() {
	// 初始化数据库
	database.InitDB()

	// 设置路由
	r := routes.SetupRoutes()

	// 启动服务器
	log.Println("Server starting on :8080...")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
} 