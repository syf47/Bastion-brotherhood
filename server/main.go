package main

import (
	"bastion-brotherhood/config"
	"bastion-brotherhood/database"
	"bastion-brotherhood/log"
	"bastion-brotherhood/routes"
)

func Init() {
	if err := config.Init(); err != nil {
		log.Fatalf("init config failed, err:%v\n", err)
	}
	log.InitLog()
	log.Info("log init success...")
}

func main() {
	// 初始化
	Init()

	// 初始化数据库
	database.InitDB()

	// 设置路由
	r := routes.SetupRoutes()

	// 启动服务器
	log.Info("Server starting on :7799...")
	if err := r.Run(":7799"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
