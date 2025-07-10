package routes

import (
	"gin_name_list/controllers"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() *gin.Engine {
	r := gin.Default()

	// 配置CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:3000", "http://127.0.0.1:8080"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization", "Cache-Control"}
	r.Use(cors.New(config))

	// API路由组
	api := r.Group("/api")
	{
		// 用户相关路由
		persons := api.Group("/persons")
		{
			persons.GET("", controllers.GetPersons)        // 获取用户列表
			persons.GET("/:id", controllers.GetPerson)     // 获取单个用户
			persons.GET("/:id/avatar", controllers.GetPersonAvatar) // 获取用户头像
			persons.POST("", controllers.CreatePerson)     // 创建用户
			persons.PUT("/:id", controllers.UpdatePerson)  // 更新用户
			persons.DELETE("/:id", controllers.DeletePerson) // 删除用户
		}
	}

	return r
} 