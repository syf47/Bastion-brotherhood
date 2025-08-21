package controllers

import (
	"bastion-brotherhood/database"
	"bastion-brotherhood/middleware"
	"bastion-brotherhood/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// RegisterRequest 注册请求结构
type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
	RealName string `json:"realname" binding:"required"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

// Register 用户注册
func Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	// 检查用户名是否已存在
	var existingUser models.User
	if err := database.DB.Where("username = ?", req.Username).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "用户名已存在",
			"data":    nil,
		})
		return
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to hash password",
			"data":    nil,
		})
		return
	}

	// 创建用户
	user := models.User{
		Username:  req.Username,
		Password:  string(hashedPassword),
		RealName:  req.RealName,
		Email:     req.Email,
		Phone:     req.Phone,
		Role:      "user", // 默认角色
		Status:    "active", // 默认状态
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := database.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to create user",
			"data":    nil,
		})
		return
	}

	// 返回用户信息（不包含密码）
	userResp := models.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		RealName:  user.RealName,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		Status:    user.Status,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    200,
		"message": "User registered successfully",
		"data":    userResp,
	})
}

// Login 用户登录
func Login(c *gin.Context) {
	var req models.LoginRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	// 查找用户
	var user models.User
	if err := database.DB.Where("username = ?", req.Username).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "用户名或密码错误",
			"data":    nil,
		})
		return
	}

	// 检查用户状态
	if user.Status != "active" {
		c.JSON(http.StatusForbidden, gin.H{
			"code":    403,
			"message": "用户账户已被禁用",
			"data":    nil,
		})
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "用户名或密码错误",
			"data":    nil,
		})
		return
	}

	// 生成JWT token
	token, err := middleware.GenerateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to generate token",
			"data":    nil,
		})
		return
	}

	// 返回用户信息和token
	userResp := models.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		RealName:  user.RealName,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		Status:    user.Status,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	loginResp := models.LoginResponse{
		Token: token,
		User:  userResp,
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Login successful",
		"data":    loginResp,
	})
}

// GetProfile 获取当前用户信息
func GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "User not authenticated",
			"data":    nil,
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "User not found",
			"data":    nil,
		})
		return
	}

	userResp := models.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		RealName:  user.RealName,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		Status:    user.Status,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    userResp,
	})
}

// UpdateProfile 更新当前用户信息
func UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "User not authenticated",
			"data":    nil,
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "User not found",
			"data":    nil,
		})
		return
	}

	var req struct {
		RealName string `json:"realname"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	// 更新字段
	if req.RealName != "" {
		user.RealName = req.RealName
	}
	if req.Email != "" {
		user.Email = req.Email
	}
	if req.Phone != "" {
		user.Phone = req.Phone
	}

	user.UpdatedAt = time.Now()

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to update profile",
			"data":    nil,
		})
		return
	}

	userResp := models.UserResponse{
		ID:        user.ID,
		Username:  user.Username,
		RealName:  user.RealName,
		Email:     user.Email,
		Phone:     user.Phone,
		Role:      user.Role,
		Status:    user.Status,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Profile updated successfully",
		"data":    userResp,
	})
}

// ChangePassword 修改密码
func ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    401,
			"message": "User not authenticated",
			"data":    nil,
		})
		return
	}

	var req struct {
		OldPassword string `json:"old_password" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "User not found",
			"data":    nil,
		})
		return
	}

	// 验证旧密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "旧密码错误",
			"data":    nil,
		})
		return
	}

	// 加密新密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to hash password",
			"data":    nil,
		})
		return
	}

	// 更新密码
	user.Password = string(hashedPassword)
	user.UpdatedAt = time.Now()

	if err := database.DB.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to update password",
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Password changed successfully",
		"data":    nil,
	})
}
