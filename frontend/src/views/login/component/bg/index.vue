<template>
  <canvas
    ref="starCanvas"
    class="star-canvas"
    @click="handleCanvasClick"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const starCanvas = ref(null)
let canvas = null
let ctx = null
let stars = []
let animationId = null

// 设置Canvas尺寸为窗口大小
function resizeCanvas() {
  if (canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
}

// 星星类
class Star {
  constructor() {
    this.reset()
  }

  reset() {
    // 随机位置
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height

    // 随机大小 - 创建层次感
    this.size = Math.random() * 1.5 + 0.5

    // 随机亮度和闪烁速度
    this.brightness = Math.random()
    this.targetBrightness = Math.random()
    this.flickerSpeed = Math.random() * 0.01 + 0.005

    // 随机移动
    this.speedX = (Math.random() - 0.5) * 0.1
    this.speedY = (Math.random() - 0.5) * 0.1

    // 星星类型（普通星星或流星）
    this.isMeteor = Math.random() < 0.02 // 2%的概率是流星
    if (this.isMeteor) {
      this.meteorSpeed = Math.random() * 3 + 2
      this.meteorTrail = []
      this.meteorLength = Math.random() * 50 + 30
      this.meteorOpacity = 1
    }
  }

  update() {
    // 对于流星
    if (this.isMeteor) {
      this.meteorOpacity -= 0.01

      // 记录流星轨迹
      this.meteorTrail.push({
        x: this.x,
        y: this.y,
        opacity: this.meteorOpacity,
      })
      if (this.meteorTrail.length > this.meteorLength) {
        this.meteorTrail.shift()
      }

      // 移动流星
      this.x += Math.cos(this.meteorAngle) * this.meteorSpeed
      this.y += Math.sin(this.meteorAngle) * this.meteorSpeed

      // 流星消失条件
      if (
        this.meteorOpacity <= 0 ||
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.reset()
        // 只有当流星完全消失时才重新生成
        if (this.meteorOpacity <= 0) {
          // 50%概率重新生成为普通星星
          this.isMeteor = Math.random() < 0.5
          if (this.isMeteor) {
            this.meteorAngle = Math.random() * Math.PI * 2
            this.meteorSpeed = Math.random() * 3 + 2
            this.meteorOpacity = 1
            this.meteorTrail = []

            // 将流星放置在画布边缘
            const side = Math.floor(Math.random() * 4)
            switch (side) {
              case 0: // 上边
                this.x = Math.random() * canvas.width
                this.y = 0
                this.meteorAngle = (Math.random() * Math.PI) / 2 + Math.PI / 4
                break
              case 1: // 右边
                this.x = canvas.width
                this.y = Math.random() * canvas.height
                this.meteorAngle =
                  (Math.random() * Math.PI) / 2 + (3 * Math.PI) / 4
                break
              case 2: // 下边
                this.x = Math.random() * canvas.width
                this.y = canvas.height
                this.meteorAngle =
                  (Math.random() * Math.PI) / 2 + (5 * Math.PI) / 4
                break
              case 3: // 左边
                this.x = 0
                this.y = Math.random() * canvas.height
                this.meteorAngle =
                  (Math.random() * Math.PI) / 2 + (7 * Math.PI) / 4
                break
            }
          }
        }
      }
      return
    }

    // 对于普通星星
    // 缓慢移动
    this.x += this.speedX
    this.y += this.speedY

    // 超出边界时重置位置
    if (this.x < 0) this.x = canvas.width
    if (this.x > canvas.width) this.x = 0
    if (this.y < 0) this.y = canvas.height
    if (this.y > canvas.height) this.y = 0

    // 闪烁效果
    const brightnessDiff = this.targetBrightness - this.brightness
    this.brightness += brightnessDiff * this.flickerSpeed

    // 随机改变目标亮度，创造不规则闪烁
    if (Math.random() < 0.01) {
      this.targetBrightness = Math.random()
    }
  }

  draw() {
    // 绘制流星
    if (this.isMeteor) {
      // 绘制流星轨迹
      for (let i = 0; i < this.meteorTrail.length; i++) {
        const point = this.meteorTrail[i]
        const opacity = point.opacity * (i / this.meteorTrail.length) * 0.8
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.beginPath()
        ctx.arc(point.x, point.y, this.size * 0.6, 0, Math.PI * 2)
        ctx.fill()
      }

      // 绘制流星头部
      ctx.fillStyle = `rgba(255, 255, 255, ${this.meteorOpacity})`
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size * 1.2, 0, Math.PI * 2)
      ctx.fill()

      return
    }

    // 绘制普通星星
    ctx.beginPath()

    // 星星亮度
    const alpha = Math.max(0, Math.min(1, this.brightness))

    // 根据星星大小调整颜色和亮度，创造层次感
    let starColor
    if (this.size > 1.2) {
      // 大星星可能是蓝色或白色
      const blueTint = Math.random()
      starColor =
        blueTint > 0.7
          ? `rgba(180, 220, 255, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`
    } else if (this.size > 0.8) {
      // 中等大小的星星
      const yellowTint = Math.random()
      starColor =
        yellowTint > 0.8
          ? `rgba(255, 255, 200, ${alpha})`
          : `rgba(255, 255, 255, ${alpha})`
    } else {
      // 小星星
      starColor = `rgba(200, 200, 255, ${alpha})`
    }

    ctx.fillStyle = starColor
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
}

// 初始化星星数组
function initStars() {
  stars.length = 0 // 清空数组
  const starCount = Math.floor((window.innerWidth * window.innerHeight) / 10000) // 根据屏幕大小调整星星数量

  for (let i = 0; i < starCount; i++) {
    const star = new Star()
    // 确保流星有正确的初始角度
    if (star.isMeteor) {
      star.meteorAngle = Math.random() * Math.PI * 2
    }
    stars.push(star)
  }
}

// 动画循环
function animate() {
  if (!ctx) return

  // 清除画布，保持透明背景
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // 更新和绘制所有星星
  for (let star of stars) {
    star.update()
    star.draw()
  }

  animationId = requestAnimationFrame(animate)
}

// 点击创建流星
function handleCanvasClick(e) {
  // 找到一个普通星星，将其转换为流星
  for (let star of stars) {
    if (!star.isMeteor) {
      star.isMeteor = true
      star.x = e.clientX
      star.y = e.clientY
      star.meteorAngle = Math.random() * Math.PI * 2
      star.meteorSpeed = Math.random() * 3 + 2
      star.meteorOpacity = 1
      star.meteorTrail = []
      break
    }
  }
}

// 初始化Canvas和动画
function init() {
  canvas = starCanvas.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  resizeCanvas()
  initStars()
  animate()
}

// 监听窗口大小变化
function handleResize() {
  resizeCanvas()
  initStars()
}

onMounted(() => {
  init()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.star-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: transparent;
  pointer-events: auto;
}
</style>
