package middleware

import (
	"bastion-brotherhood/config"
	"bastion-brotherhood/models"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// getJWTSecret 从配置文件获取JWT密钥
func getJWTSecret() []byte {
	cfg := config.GetGlobalConfig()
	if cfg.JWTConfig != nil && cfg.JWTConfig.SecretKey != "" {
		return []byte(cfg.JWTConfig.SecretKey)
	}
	// 默认密钥（生产环境中应该配置）
	return []byte("your-secret-key-change-in-production")
}

// Claims JWT声明结构
type Claims struct {
	UserID   uint   `json:"user_id"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken 生成JWT token
func GenerateToken(user models.User) (string, error) {
	claims := Claims{
		UserID:   user.ID,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24小时过期
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}

// ValidateToken 验证JWT token
func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return getJWTSecret(), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

// AuthMiddleware JWT认证中间件
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 从请求头获取token
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Authorization header is required",
				"data":    nil,
			})
			c.Abort()
			return
		}

		// 检查token格式
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Invalid token format",
				"data":    nil,
			})
			c.Abort()
			return
		}

		tokenString := tokenParts[1]

		// 验证token
		claims, err := ValidateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"code":    401,
				"message": "Invalid or expired token",
				"data":    nil,
			})
			c.Abort()
			return
		}

		// 将用户信息存储到上下文中
		c.Set("user_id", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)

		c.Next()
	}
}

// OptionalAuthMiddleware 可选的JWT认证中间件（不强制要求登录）
func OptionalAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.Next()
			return
		}

		tokenString := tokenParts[1]

		claims, err := ValidateToken(tokenString)
		if err == nil {
			c.Set("user_id", claims.UserID)
			c.Set("username", claims.Username)
			c.Set("role", claims.Role)
		}

		c.Next()
	}
}
