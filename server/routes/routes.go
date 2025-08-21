package routes

import (
	"bastion-brotherhood/controllers"
	"bastion-brotherhood/middleware"

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
		// 用户认证相关路由（无需登录）
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register) // 用户注册
			auth.POST("/login", controllers.Login)       // 用户登录
		}

		// 用户相关路由（需要登录）
		users := api.Group("/users")
		users.Use(middleware.AuthMiddleware()) // 添加JWT认证中间件
		{
			users.GET("/profile", controllers.GetProfile)           // 获取当前用户信息
			users.PUT("/profile", controllers.UpdateProfile)       // 更新当前用户信息
			users.PUT("/password", controllers.ChangePassword)     // 修改密码
		}

		// 用户管理相关路由（需要登录）
		persons := api.Group("/persons")
		persons.Use(middleware.AuthMiddleware()) // 添加JWT认证中间件
		{
			persons.GET("", controllers.GetPersons)                     // 获取用户列表
			persons.GET("/:id", controllers.GetPerson)                  // 获取单个用户
			persons.GET("/:id/avatar", controllers.GetPersonAvatar)     // 获取用户头像
			persons.POST("", controllers.CreatePerson)                  // 创建用户（JSON格式）
			persons.POST("/:id/avatar", controllers.UploadPersonAvatar) // 上传用户头像
			persons.PUT("/:id", controllers.UpdatePerson)               // 更新用户
			persons.DELETE("/:id", controllers.DeletePerson)            // 删除用户
		}
	}

	return r
}
