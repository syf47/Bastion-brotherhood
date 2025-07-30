<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import { Background, LoginForm } from './components'
import { BlurInText } from '@/components/ui/blur-in-text'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { delay } from '@/utils/delay'
import { toast } from 'vue-sonner'
import { setToken } from '@/utils/token'

interface LoginInfo {
  username: string
  password: string
}

const FAKE_TOKEN = 'access-token'

const router = useRouter()

const loading = ref(false)

const handleLogin = async ({ password, username }: LoginInfo) => {
  loading.value = true
  await delay()
  loading.value = false

  if (password === 'wcnm' && username === 'wcnm') {
    setToken(FAKE_TOKEN)
    router.push('/')
  } else {
    toast.error('用户名或密码错误')
  }
}
</script>

<template>
  <div
    class="size-full relative flex items-center justify-center overflow-hidden"
  >
    <Background class="absolute inset-0 overflow-hidden" />
    <Motion
      :transition="{
        type: 'spring',
      }"
      class="relative z-20 w-full max-w-md bg-background/40 dark:bg-background/10 backdrop-blur-3xl border border-foreground/10 rounded-3xl p-8 shadow-2xl"
    >
      <!-- 标题 -->
      <Motion class="text-center mb-10">
        <BlurInText
          words="堡垒之门"
          mode="pre"
          class="text-2xl md:text-4xl font-bold mb-4 drop-shadow-lg"
        />
        <BlurInText
          words="穿越宇宙维度的入口"
          mode="pre"
          class="text-md md:text-lg"
        />
      </Motion>
      <LoginForm :loading="loading" @submit="handleLogin" />
      <div class="flex justify-center mt-4">
        <ThemeSwitcher />
      </div>
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
