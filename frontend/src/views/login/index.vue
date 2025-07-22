<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'

const router = useRouter()

const form = ref({
  email: '宇宙探索者',
  password: '',
  rememberMe: false,
})

const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
  // 这里可以添加登录逻辑
  console.log('Login attempt:', form.value)

  // 模拟登录延迟
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 登录成功后跳转到首页
  router.push('/')
  isLoading.value = false
}

const handleSocialLogin = (provider: string) => {
  console.log(`Login with ${provider}`)
}

// 动画配置
const containerInitial = { opacity: 0, y: 50 }
const containerAnimate = { opacity: 1, y: 0 }
const containerTransition = { duration: 0.8, delay: 0.2 }

const itemInitial = { opacity: 0, y: 20 }
const itemAnimate = { opacity: 1, y: 0 }
const itemTransition = { duration: 0.6 }

const titleInitial = { opacity: 0, scale: 0.8 }
const titleAnimate = { opacity: 1, scale: 1 }
const titleTransition = { duration: 0.8, delay: 0.4 }

const formInitial = { opacity: 0, y: 30 }
const formAnimate = { opacity: 1, y: 0 }
const formTransition = { duration: 0.6, delay: 0.6 }
</script>

<template>
  <div
    class="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600"
  >
    <!-- 星空背景 -->
    <Motion
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 2, ease: 'easeOut' }"
      class="absolute inset-0 overflow-hidden"
    >
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </Motion>

    <!-- 主要内容 -->
    <Motion
      :initial="containerInitial"
      :animate="containerAnimate"
      :transition="containerTransition"
      class="relative z-10 w-full max-w-xl p-4"
    >
      <Motion
        :initial="itemInitial"
        :animate="itemAnimate"
        :transition="itemTransition"
        class="bg-background/10 backdrop-blur-xl border border-background/20 rounded-3xl p-4 shadow-2xl"
      >
        <!-- 标题 -->
        <Motion
          :initial="titleInitial"
          :animate="titleAnimate"
          :transition="titleTransition"
          class="text-center mb-10"
        >
          <Motion
            :initial="{ opacity: 0, y: -20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.6 }"
            tag="h1"
            class="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            堡垒之门
          </Motion>
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.8 }"
            tag="p"
            class="text-white/80 text-lg md:text-xl"
          >
            穿越宇宙维度的入口
          </Motion>
        </Motion>

        <!-- 登录表单 -->
        <Motion
          :initial="formInitial"
          :animate="formAnimate"
          :transition="formTransition"
          tag="form"
          @submit.prevent="handleLogin"
          class="space-y-6 max-w-md mx-auto"
        >
          <!-- 邮箱输入 -->
          <Motion
            :initial="{ opacity: 0, x: -20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, delay: 0.8 }"
            class="space-y-2"
          >
            <label
              class="flex items-center gap-2 text-white/90 text-sm font-medium"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              宇宙探索者昵称
            </label>
            <Motion
              :whileFocus="{
                scale: 1.02,
                borderColor: 'rgba(255,255,255,0.4)',
              }"
              :transition="{ duration: 0.2 }"
            >
              <input
                v-model="form.email"
                type="email"
                class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                placeholder="explorer@galaxy.universe"
                required
              />
            </Motion>
          </Motion>

          <!-- 密码输入 -->
          <Motion
            :initial="{ opacity: 0, x: 20 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, delay: 1.0 }"
            class="space-y-2"
          >
            <label
              class="flex items-center gap-2 text-white/90 text-sm font-medium"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <circle cx="12" cy="16" r="1" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              量子安全密钥
            </label>
            <div class="relative">
              <Motion
                :whileFocus="{
                  scale: 1.02,
                  borderColor: 'rgba(255,255,255,0.4)',
                }"
                :transition="{ duration: 0.2 }"
              >
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  placeholder="输入您的维度密钥"
                  required
                />
              </Motion>
              <Motion
                :whileHover="{ scale: 1.1, color: 'rgba(255,255,255,0.9)' }"
                :whileTap="{ scale: 0.95 }"
                :transition="{ duration: 0.2 }"
                tag="button"
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors duration-200"
              >
                <svg
                  v-if="!showPassword"
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  class="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </Motion>
            </div>
          </Motion>

          <!-- 记住我和忘记密码 -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, delay: 1.2 }"
            class="flex items-center justify-between"
          >
            <Motion
              :whileHover="{ scale: 1.05 }"
              :transition="{ duration: 0.2 }"
              tag="label"
              class="flex items-center gap-2 text-white/80 text-sm cursor-pointer"
            >
              <input
                v-model="form.rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-white/30 bg-white/10 text-pink-500 focus:ring-pink-500 focus:ring-2"
              />
              跨维度记住我
            </Motion>
            <Motion
              :whileHover="{ scale: 1.05, color: 'rgba(255,255,255,1)' }"
              :transition="{ duration: 0.2 }"
              tag="a"
              href="#"
              class="text-white/80 hover:text-white text-sm transition-colors duration-200"
            >
              迷失在虚空中？
            </Motion>
          </Motion>

          <!-- 登录按钮 -->
          <Motion
            :initial="{ opacity: 0, scale: 0.8 }"
            :animate="{ opacity: 1, scale: isLoading ? 0.95 : 1 }"
            :transition="{ duration: 0.6, delay: 1.4 }"
            :whileHover="!isLoading ? { scale: 1.02, y: -2 } : {}"
            :whileTap="!isLoading ? { scale: 0.98 } : {}"
            tag="button"
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 bg-[length:200%_200%] animate-gradient disabled:opacity-70"
          >
            <Motion
              v-if="isLoading"
              :initial="{ opacity: 0, rotate: 0 }"
              :animate="{ opacity: 1, rotate: 360 }"
              :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
              class="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            <Motion
              v-else
              :initial="{ opacity: 0, x: -10 }"
              :animate="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.3 }"
            >
              <svg
                class="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10,17 15,12 10,7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </Motion>
            {{ isLoading ? '正在进入...' : '进入银河系' }}
          </Motion>

          <!-- 分割线 -->
          <Motion
            :initial="{ opacity: 0, scaleX: 0 }"
            :animate="{ opacity: 1, scaleX: 1 }"
            :transition="{ duration: 0.6, delay: 1.6 }"
            class="relative flex items-center justify-center"
          >
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20"></div>
            </div>
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.4, delay: 1.8 }"
              class="relative bg-white/10 px-4 text-white/60 text-sm"
            >
              或通过以下方式导航
            </Motion>
          </Motion>

          <!-- 社交登录 -->
          <Motion
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 2.0 }"
            class="flex gap-3 justify-center"
          >
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.4, delay: 2.2 }"
              :whileHover="{ scale: 1.1, y: -3 }"
              :whileTap="{ scale: 0.95 }"
              tag="button"
              type="button"
              @click="handleSocialLogin('google')"
              class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1"
              title="Google"
            >
              <svg class="w-6 h-6 text-white" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Motion>
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.4, delay: 2.4 }"
              :whileHover="{ scale: 1.1, y: -3 }"
              :whileTap="{ scale: 0.95 }"
              tag="button"
              type="button"
              @click="handleSocialLogin('github')"
              class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1"
              title="GitHub"
            >
              <svg
                class="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
            </Motion>
            <Motion
              :initial="{ opacity: 0, scale: 0.8 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ duration: 0.4, delay: 2.6 }"
              :whileHover="{ scale: 1.1, y: -3 }"
              :whileTap="{ scale: 0.95 }"
              tag="button"
              type="button"
              @click="handleSocialLogin('discord')"
              class="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 transition-all duration-300 hover:-translate-y-1"
              title="Discord"
            >
              <svg
                class="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"
                />
              </svg>
            </Motion>
          </Motion>
        </Motion>

        <!-- 注册链接 -->
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 2.8 }"
          class="text-center mt-8 text-white/80 text-sm"
        >
          <span>新的宇宙探索者？</span>
          <Motion
            :whileHover="{ scale: 1.05, color: '#f472b6' }"
            :transition="{ duration: 0.2 }"
            tag="a"
            href="#"
            class="text-pink-400 hover:text-pink-300 font-medium transition-colors duration-200 ml-1"
          >
            开始您的堡垒之旅
          </Motion>
        </Motion>
      </Motion>
    </Motion>
  </div>
</template>

<style scoped>
/* 星空背景动画 */
.stars,
.stars2,
.stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.stars {
  background-image:
    radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(
      2px 2px at 40px 70px,
      rgba(255, 255, 255, 0.8),
      transparent
    ),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(
      1px 1px at 130px 80px,
      rgba(255, 255, 255, 0.6),
      transparent
    ),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: zoom 20s infinite linear;
}

.stars2 {
  background-image:
    radial-gradient(1px 1px at 40px 60px, #fff, transparent),
    radial-gradient(
      1px 1px at 120px 10px,
      rgba(255, 255, 255, 0.7),
      transparent
    ),
    radial-gradient(1px 1px at 160px 80px, #eee, transparent);
  background-repeat: repeat;
  background-size: 300px 150px;
  animation: zoom 40s infinite linear;
}

.stars3 {
  background-image:
    radial-gradient(
      1px 1px at 10px 10px,
      rgba(255, 255, 255, 0.5),
      transparent
    ),
    radial-gradient(
      1px 1px at 150px 150px,
      rgba(255, 255, 255, 0.4),
      transparent
    );
  background-repeat: repeat;
  background-size: 400px 200px;
  animation: zoom 60s infinite linear;
}

@keyframes zoom {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* 渐变动画 */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  animation: gradient 3s ease infinite;
}
</style>
