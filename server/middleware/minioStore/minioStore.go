package minioStore

import (
	"github.com/minio/minio-go/v6"
	"strings"
	"sync"
	"bastion-brotherhood/config"
	"bastion-brotherhood/log"
	"bastion-brotherhood/middleware/snowflake"
)

type Minio struct {
	MinioClient  *minio.Client
	Endpoint     string
	Port         string
	AvatarBuckets   string
}

var (
	client         Minio
	minioStoreOnce sync.Once
)

func GetMinio() Minio {
	minioStoreOnce.Do(initMinio)
	return client
}

func initMinio() {
	conf := config.GetGlobalConfig().MinioConfig

	endpoint := conf.Host
	port := conf.Port
	endpoint = endpoint + ":" + port
	accessKeyID := conf.AccessKeyID
	secretAccessKey := conf.SecretAccessKey
	avatarBucket := conf.AvatarBuckets

	// 初使化 minio client对象。
	minioClient, err := minio.New(
		endpoint, accessKeyID, secretAccessKey, false)
	if err != nil {
		panic(err)
	}
	// 创建存储桶
	creatBucket(minioClient, avatarBucket)
	client = Minio{minioClient, endpoint, port, avatarBucket}
	return
}

func creatBucket(m *minio.Client, bucket string) {
	found, err := m.BucketExists(bucket)
	if err != nil {
		log.Errorf("check %s bucketExists err:%s", bucket, err.Error())
	}
	if !found {
		m.MakeBucket(bucket, "us-east-1")
	}
	// 设置桶策略
	policy := `{"Version": "2012-10-17",
				"Statement": 
					[{
						"Action":["s3:GetObject"],
						"Effect": "Allow",
						"Principal": {"AWS": ["*"]},
						"Resource": ["arn:aws:s3:::` + bucket + `/*"],
						"Sid": ""
					}]
				}`
	err = m.SetBucketPolicy(bucket, policy)
	if err != nil {
		log.Errorf("SetBucketPolicy %s  err:%s", bucket, err.Error())
	}

	log.Infof("create bucket %s success", bucket)
}

func (m *Minio) UploadFile(filetype, file, userName string) (string, error) {
	var fileName strings.Builder
	var contentType, Suffix, bucket string
	if filetype == "avatar" {
		contentType = "image/jpeg"
		Suffix = ".jpg"
		bucket = m.AvatarBuckets
	}
	fileName.WriteString(userName)
	fileName.WriteString("_")
	// 生成雪花算法ID
	snowflakeID := snowflake.GenID()
	// 写入雪花算法ID
	fileName.WriteString(snowflakeID)
	fileName.WriteString(Suffix)
	n, err := m.MinioClient.FPutObject(bucket, fileName.String(), file, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		log.Errorf("upload file error:%s", err.Error())
		return "", err
	}
	log.Infof("upload file %d byte success,fileName:%s", n, fileName)
	url := "http://" + m.Endpoint + "/" + bucket + "/" + fileName.String()
	return url, nil
}
