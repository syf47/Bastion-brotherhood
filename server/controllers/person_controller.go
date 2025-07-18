package controllers

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/jpeg"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"bastion-brotherhood/database"
	"bastion-brotherhood/log"
	"bastion-brotherhood/middleware/minioStore"
	"bastion-brotherhood/models"

	"github.com/gin-gonic/gin"
	"github.com/nfnt/resize"
)

// compressImage 压缩图片为缩略图
func compressImage(imageData []byte, maxWidth, maxHeight uint) ([]byte, error) {
	// 解码图片
	img, _, err := image.Decode(bytes.NewReader(imageData))
	if err != nil {
		return nil, err
	}

	// 计算新尺寸，保持宽高比
	bounds := img.Bounds()
	width := uint(bounds.Dx())
	height := uint(bounds.Dy())

	// 如果图片已经足够小，直接返回
	if width <= maxWidth && height <= maxHeight {
		return imageData, nil
	}

	// 按比例缩放
	if width > height {
		height = height * maxWidth / width
		width = maxWidth
	} else {
		width = width * maxHeight / height
		height = maxHeight
	}

	// 调整图片大小
	resizedImg := resize.Resize(width, height, img, resize.Lanczos3)

	// 编码为JPEG
	var buf bytes.Buffer
	err = jpeg.Encode(&buf, resizedImg, &jpeg.Options{Quality: 80})
	if err != nil {
		return nil, err
	}

	return buf.Bytes(), nil
}

// GetPersons 获取用户列表
func GetPersons(c *gin.Context) {
	var persons []models.Person

	// 查询总数
	var total int64
	database.DB.Model(&models.Person{}).Count(&total)

	// 查询所有用户，包含头像数据
	if err := database.DB.Find(&persons).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to fetch persons",
			"data":    nil,
		})
		return
	}

	// 转换为响应格式，头像字段优先返回minio预签链接
	var response []models.PersonResponse
	for _, person := range persons {
		personResp := models.PersonResponse{
			ID:        person.ID,
			Name:      person.Name,
			RealName:  person.RealName,
			AvatarURL: person.AvatarURL,
			Phone:     person.Phone,
			Wechat:    person.Wechat,
			Position:  person.Position,
			Email:     person.Email,
			Region:    person.Region,
			CreatedAt: person.CreatedAt,
			UpdatedAt: person.UpdatedAt,
		}

		//如果有头像数据，压缩后返回
		if len(person.AvatarBlob) > 0 {
			// 压缩头像为64x64缩略图
			compressedData, err := compressImage(person.AvatarBlob, 64, 64)
			if err == nil {
				personResp.Avatar = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(compressedData)
			} else {
				// 如果压缩失败，返回原图
				personResp.Avatar = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(person.AvatarBlob)
			}
		} else {
			personResp.Avatar = ""
		}

		response = append(response, personResp)
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    response,
		"total":   total,
	})
}

// GetPerson 获取单个用户
func GetPerson(c *gin.Context) {
	id := c.Param("id")
	var person models.Person

	if err := database.DB.First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Person not found",
			"data":    nil,
		})
		return
	}

	personResp := models.PersonResponse{
		ID:        person.ID,
		Name:      person.Name,
		RealName:  person.RealName,
		Phone:     person.Phone,
		Wechat:    person.Wechat,
		Position:  person.Position,
		Email:     person.Email,
		Region:    person.Region,
		CreatedAt: person.CreatedAt,
		UpdatedAt: person.UpdatedAt,
	}

	if person.AvatarURL != "" {
		personResp.Avatar = person.AvatarURL
	} else if len(person.AvatarBlob) > 0 {
		personResp.Avatar = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(person.AvatarBlob)
	} else {
		personResp.Avatar = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    personResp,
	})
}

// CreatePersonRequest 创建用户请求结构
type CreatePersonRequest struct {
	Name     string `json:"name" binding:"required"`
	RealName string `json:"realname" binding:"required"`
	Phone    string `json:"phone"`
	Wechat   string `json:"wechat"`
	Position string `json:"position"`
	Email    string `json:"email"`
	Region   string `json:"region"`
}

// UpdatePersonRequest 更新用户请求结构
type UpdatePersonRequest struct {
	Name     string `json:"name"`
	RealName string `json:"realname"`
	Phone    string `json:"phone"`
	Wechat   string `json:"wechat"`
	Position string `json:"position"`
	Email    string `json:"email"`
	Region   string `json:"region"`
}

// CreatePerson 创建用户（重构版本 - 使用JSON）
func CreatePerson(c *gin.Context) {
	var req CreatePersonRequest

	// 绑定JSON数据
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	// 检查realname是否已存在
	var existPerson models.Person
	err := database.DB.Where("realname = ?", req.RealName).First(&existPerson).Error
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "该用户已存在",
			"data":    nil,
		})
		return
	}

	// 创建用户对象
	person := models.Person{
		Name:      req.Name,
		RealName:  req.RealName,
		Phone:     req.Phone,
		Wechat:    req.Wechat,
		Position:  req.Position,
		Email:     req.Email,
		Region:    req.Region,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// 设置默认头像
	defaultAvatarPath := "./assets/default_avatar.png"
	defaultAvatarData, err := os.ReadFile(defaultAvatarPath)
	if err != nil {
		log.Errorf("读取默认头像文件失败: %v", err)
	} else {
		person.AvatarBlob = defaultAvatarData
		log.Info("使用默认头像")
	}

	// 保存到数据库
	if err := database.DB.Create(&person).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to create person",
			"data":    nil,
		})
		return
	}

	// 返回创建的用户信息
	personResp := models.PersonResponse{
		ID:        person.ID,
		Name:      person.Name,
		RealName:  person.RealName,
		Phone:     person.Phone,
		Wechat:    person.Wechat,
		Position:  person.Position,
		Email:     person.Email,
		Region:    person.Region,
		CreatedAt: person.CreatedAt,
		UpdatedAt: person.UpdatedAt,
	}

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "Person created successfully",
		"data":    personResp,
	})
}

// UploadPersonAvatar 上传用户头像（新增接口）
func UploadPersonAvatar(c *gin.Context) {
	id := c.Param("id")
	var person models.Person

	// 查找用户
	if err := database.DB.First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Person not found",
			"data":    nil,
		})
		return
	}

	// 处理头像上传
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "No avatar file provided",
			"data":    nil,
		})
		return
	}

	// 验证文件类型
	if !isValidImageFile(file.Filename) {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid image file type",
			"data":    nil,
		})
		return
	}

	// 验证文件大小（限制为5MB）
	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "File size too large (max 5MB)",
			"data":    nil,
		})
		return
	}

	src, err := file.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Failed to open avatar file",
			"data":    nil,
		})
		return
	}
	defer src.Close()

	// 上传头像至minio
	minioClient := minioStore.GetMinio()
	avatarUrl, err := minioClient.UploadFile("avatar", src, file.Size, person.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": err.Error(),
			"data":    nil,
		})
		return
	}

	// 更新用户头像URL
	person.AvatarURL = avatarUrl
	person.UpdatedAt = time.Now()

	if err := database.DB.Save(&person).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to update avatar",
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Avatar uploaded successfully",
		"data": gin.H{
			"avatar_url": avatarUrl,
		},
	})
}

// isValidImageFile 验证是否为有效的图片文件
func isValidImageFile(filename string) bool {
	validExtensions := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
	for _, ext := range validExtensions {
		if strings.HasSuffix(strings.ToLower(filename), ext) {
			return true
		}
	}
	return false
}

// UpdatePerson 更新用户（重构版本 - 使用JSON）
func UpdatePerson(c *gin.Context) {
	id := c.Param("id")
	var person models.Person

	// 查找用户
	if err := database.DB.First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Person not found",
			"data":    nil,
		})
		return
	}

	var req UpdatePersonRequest

	// 绑定JSON数据
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid request data: " + err.Error(),
			"data":    nil,
		})
		return
	}

	// 更新字段（只更新非空字段）
	if req.Name != "" {
		person.Name = req.Name
	}
	if req.RealName != "" {
		person.RealName = req.RealName
	}
	if req.Phone != "" {
		person.Phone = req.Phone
	}
	if req.Wechat != "" {
		person.Wechat = req.Wechat
	}
	if req.Position != "" {
		person.Position = req.Position
	}
	if req.Email != "" {
		person.Email = req.Email
	}
	if req.Region != "" {
		person.Region = req.Region
	}

	person.UpdatedAt = time.Now()

	// 保存更新
	if err := database.DB.Save(&person).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to update person",
			"data":    nil,
		})
		return
	}

	// 返回更新后的用户信息
	personResp := models.PersonResponse{
		ID:        person.ID,
		Name:      person.Name,
		RealName:  person.RealName,
		Phone:     person.Phone,
		Wechat:    person.Wechat,
		Position:  person.Position,
		Email:     person.Email,
		Region:    person.Region,
		CreatedAt: person.CreatedAt,
		UpdatedAt: person.UpdatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Person updated successfully",
		"data":    personResp,
	})
}

// DeletePerson 删除用户
func DeletePerson(c *gin.Context) {
	id := c.Param("id")

	// 转换ID为uint
	personID, err := strconv.ParseUint(id, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "Invalid person ID",
			"data":    nil,
		})
		return
	}

	// 软删除用户
	if err := database.DB.Delete(&models.Person{}, uint(personID)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to delete person",
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Person deleted successfully",
		"data":    nil,
	})
}

// GetPersonAvatar 获取用户头像
func GetPersonAvatar(c *gin.Context) {
	id := c.Param("id")
	var person models.Person

	// 查询头像字段和URL
	if err := database.DB.Select("avatar_blob", "avatar_url").First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Person not found",
			"data":    nil,
		})
		return
	}

	// 优先返回minio的URL
	if person.AvatarURL != "" {
		c.JSON(http.StatusOK, gin.H{
			"code":    200,
			"message": "success",
			"data": gin.H{
				"avatar_url": person.AvatarURL,
			},
		})
		return
	}

	// 没有URL则返回base64
	if len(person.AvatarBlob) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Avatar not found",
			"data":    nil,
		})
		return
	}

	avatar := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(person.AvatarBlob)
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"avatar": avatar,
		},
	})
}
