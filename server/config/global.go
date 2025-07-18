package config

import (
	"os"
	"path/filepath"
)

// 项目主目录
var rootDir string

func GetRootDir() string {
	return rootDir
}

func init() {
	inferRootDir()
	// 初始化配置
}

// 推断 Root目录（copy就行）
func inferRootDir() {
	pwd, err := os.Getwd()
	if err != nil {
		panic(err)
	}

	var infer func(string) string
	infer = func(dir string) string {
		if exists(dir + "/main.go") {
			return dir
		}

		// 查看dir的父目录
		parent := filepath.Dir(dir)
		
		// 防止无限递归：如果到达根目录或者目录没有变化，就返回当前工作目录
		if parent == dir || parent == "/" {
			return pwd
		}
		
		return infer(parent)
	}

	rootDir = infer(pwd)
}

func exists(dir string) bool {
	// 查找主机是不是存在 dir
	_, err := os.Stat(dir)
	return err == nil || os.IsExist(err)
}
