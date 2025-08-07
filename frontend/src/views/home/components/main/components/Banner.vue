<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Motion } from 'motion-v'
import { usePersonnelStore } from '@/store/modules/personnel'
import { ref, onMounted } from 'vue'
import { debounce } from '@/utils/debounce'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { PersonCreator } from '@/components/personnel'
import { LogOut, Music } from 'lucide-vue-next'
import { removeToken } from '@/utils/token'
import { useRouter } from 'vue-router'
import { showAlert } from '@/components/hooks'

const router = useRouter()

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const personnelStore = usePersonnelStore()

const filter = ref('')
const isPlaying = ref(false)
const audioElement = ref<HTMLAudioElement | null>(null)

const handleFilter = debounce((query: string) => {
  personnelStore.setQuery(query)
}, 200)

function initMusic() {
  if (!audioElement.value) {
    // 创建音频元素
    audioElement.value = new Audio('/永远的兄弟-刀郎.mp3')
    audioElement.value.loop = true
    audioElement.value.volume = 1

    audioElement.value.addEventListener('play', () => {
      isPlaying.value = true
    })

    audioElement.value.addEventListener('pause', () => {
      isPlaying.value = false
    })

    audioElement.value.addEventListener('ended', () => {
      isPlaying.value = false
    })
  }
}

function showMusicControl() {
  setTimeout(() => {
    showAlert({
      title: '音乐',
      description: '当前播放：永远的兄弟',
      cancelText: 'display:none',
      actionText: isPlaying.value ? '你要干寄吧啥' : '怎么又回来了好兄弟?',
      onAction: () => {
        if (isPlaying.value) {
          if (audioElement.value) {
            audioElement.value.pause()
            isPlaying.value = false
          }
        } else {
          startMusic()
        }
      },
    })
  }, 100)
}

function startMusic() {
  if (!audioElement.value) {
    initMusic()
    return
  }
  const playPromise = audioElement.value.play()
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isPlaying.value = true
      })
      .catch(error => {
        isPlaying.value = false
      })
  }
}

function logout() {
  showAlert({
    title: '注销登录',
    description: '确定要注销登录吗？',
    onAction: () => {
      removeToken()
      router.push('/login')
    },
  })
}

onMounted(() => {
  initMusic()

  const handleFirstInteraction = () => {
    if (audioElement.value && audioElement.value.paused) {
      startMusic()
    }
    document.removeEventListener('click', handleFirstInteraction)
    document.removeEventListener('keydown', handleFirstInteraction)
    document.removeEventListener('touchstart', handleFirstInteraction)
  }

  document.addEventListener('click', handleFirstInteraction)
  document.addEventListener('keydown', handleFirstInteraction)
  document.addEventListener('touchstart', handleFirstInteraction)
})
</script>

<template>
  <Motion :class="cn('z-10', props.class)" :initial="{ opacity: 0, y: -100 }" :animate="{ opacity: 1, y: 0 }"
    :transition="{
      type: 'spring',
      delay: 0.8,
    }">
    <LiquidGlass container-class="w-full h-16 shadow-lg" class="bg-background/20">
    }"
  >
    <LiquidGlass container-class="w-full h-16 shadow-lg bg-background/10">
      <div class="flex px-4 justify-between items-center size-full">
        <Motion as="h2">欢迎来到不朽堡垒</Motion>
        <div class="flex items-center gap-2">
          <Input class="w-32 md:w-64" placeholder="搜索兄弟" v-model:model-value="filter"
            @update:model-value="(value) => handleFilter(value as string)" />
          <PersonCreator />
          <Button size="icon" variant="ghost" @click="showMusicControl"
            :class="isPlaying ? 'text-green-500' : 'text-gray-400'">
            <Music class="size-4" />
          </Button>
          <ThemeSwitcher class="size-4" />
          <Button size="icon" variant="ghost" @click="logout">
            <LogOut class="size-4" />
          </Button>
        </div>
      </div>
    </LiquidGlass>
  </Motion>
</template>
