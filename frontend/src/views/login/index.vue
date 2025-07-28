<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { User, LockKeyhole } from 'lucide-vue-next'
import { Background, LoginForm } from './components'

const router = useRouter()

const form = ref({
  email: '德莱厄斯',
  password: '',
  rememberMe: false,
})

const showPassword = ref(false)
const isLoading = ref(false)

const handleLogin = async () => {
  isLoading.value = true
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

const itemInitial = { y: 20, scale: 0.9 }
const itemAnimate = { y: 0, scale: 1 }
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
    class="size-full relative flex items-center justify-center overflow-hidden"
  >
    <Background class="absolute inset-0 overflow-hidden z-0" />

    <Motion
      :initial="itemInitial"
      :animate="itemAnimate"
      :transition="itemTransition"
      class="relative z-20 w-full max-w-md bg-black/10 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl"
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
          class="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg"
        >
          堡垒之门
        </Motion>
        <Motion
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.8 }"
          tag="p"
          class="text-white/80 text-md md:text-lg"
        >
          穿越宇宙维度的入口
        </Motion>
      </Motion>

      <!-- 登录表单 -->
      <!-- <Motion
        :initial="formInitial"
        :animate="formAnimate"
        :transition="formTransition"
        tag="form"
        @submit.prevent="handleLogin"
        class="space-y-6"
      >
        <Motion
          :initial="{ opacity: 0, x: -20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 0.8 }"
          class="space-y-2"
        >
          <label
            class="flex items-center gap-2 text-white/90 text-sm font-medium"
          >
            <User class="w-4 h-4" />
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
        <Motion
          :initial="{ opacity: 0, x: 20 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.5, delay: 1.0 }"
          class="space-y-2"
        >
          <label
            class="flex items-center gap-2 text-white/90 text-sm font-medium"
          >
            <LockKeyhole class="w-4 h-4" />
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
      </Motion> -->
      <LoginForm />
    </Motion>
  </div>
</template>

<style scoped>
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
