package controllers

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/jpeg"
	"io"
	"net/http"
	"strconv"
	"time"

	"gin_name_list/database"
	"gin_name_list/models"
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

	// 转换为响应格式，包含压缩后的头像
	var response []models.PersonResponse
	for _, person := range persons {
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

		// 如果有头像数据，压缩后返回
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

	// 如果有头像数据，转换为base64
	if len(person.AvatarBlob) > 0 {
		personResp.Avatar = "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(person.AvatarBlob)
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data":    personResp,
	})
}

// CreatePerson 创建用户
func CreatePerson(c *gin.Context) {
	var person models.Person

	// 获取表单数据
	person.Name = c.PostForm("name")
	person.RealName = c.PostForm("realname")
	person.Phone = c.PostForm("phone")
	person.Wechat = c.PostForm("wechat")
	person.Position = c.PostForm("position")
	person.Email = c.PostForm("email")
	person.Region = c.PostForm("region")
	person.CreatedAt = time.Now()
	person.UpdatedAt = time.Now()

	// 处理头像上传
	file, err := c.FormFile("avatar")
	if err == nil {
		// 打开文件
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

		// 读取文件内容
		avatarData, err := io.ReadAll(src)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    400,
				"message": "Failed to read avatar file",
				"data":    nil,
			})
			return
		}

		person.AvatarBlob = avatarData
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

	c.JSON(http.StatusCreated, gin.H{
		"code":    201,
		"message": "Person created successfully",
		"data":    person,
	})
}

// UpdatePerson 更新用户
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

	// 更新表单数据
	if name := c.PostForm("name"); name != "" {
		person.Name = name
	}
	if realname := c.PostForm("realname"); realname != "" {
		person.RealName = realname
	}
	if phone := c.PostForm("phone"); phone != "" {
		person.Phone = phone
	}
	if wechat := c.PostForm("wechat"); wechat != "" {
		person.Wechat = wechat
	}
	if position := c.PostForm("position"); position != "" {
		person.Position = position
	}
	if email := c.PostForm("email"); email != "" {
		person.Email = email
	}
	if region := c.PostForm("region"); region != "" {
		person.Region = region
	}

	person.UpdatedAt = time.Now()

	// 处理头像上传
	file, err := c.FormFile("avatar")
	if err == nil {
		// 打开文件
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

		// 读取文件内容
		avatarData, err := io.ReadAll(src)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"code":    400,
				"message": "Failed to read avatar file",
				"data":    nil,
			})
			return
		}

		person.AvatarBlob = avatarData
	}

	// 保存更新
	if err := database.DB.Save(&person).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "Failed to update person",
			"data":    nil,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "Person updated successfully",
		"data":    person,
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

	// 只查询头像字段
	if err := database.DB.Select("avatar_blob").First(&person, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Person not found",
			"data":    nil,
		})
		return
	}

	// 如果没有头像数据
	if len(person.AvatarBlob) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    404,
			"message": "Avatar not found",
			"data":    nil,
		})
		return
	}

	// 返回base64编码的头像
	avatar := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(person.AvatarBlob)
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"message": "success",
		"data": gin.H{
			"avatar": avatar,
		},
	})
}
