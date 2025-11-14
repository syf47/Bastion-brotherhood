<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { LiquidGlass } from '@ui/liquid-glass'
import { Input } from '@ui/input'
import { Button } from '@ui/button'
import { Motion } from 'motion-v'
import { usePersonnelStore } from '@store'
import { ref, onMounted } from 'vue'
import { debounce } from '@/utils/debounce'
import { ThemeSwitcher } from '@ui/theme-switcher'
import { PersonCreator } from '@/components/personnel'
import { LogOut, Music } from 'lucide-vue-next'
import { removeToken } from '@/utils/token'
import { useRouter } from 'vue-router'
import { showAlert } from '@/components/hooks'
import { __DEV__ } from '@/utils/env'

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
      cancelText: '俺不中嘞',
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
      .catch(() => {
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
    if (__DEV__) return
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
  <Motion
    :class="cn('z-10 flex items-center justify-center', props.class)"
    :initial="{ opacity: 0, y: 100 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      type: 'spring',
      delay: 0.8,
    }"
  >
    <LiquidGlass
      container-class="w-fit h-16 shadow-lg"
      :radius="32"
      class="bg-background/10"
    >
      <div class="flex px-4 justify-between items-center size-full">
        <div class="flex items-center gap-1">
          <Input
            class="w-32 md:w-64 rounded-full"
            placeholder="搜索兄弟"
            v-model:model-value="filter"
            @update:model-value="(value) => handleFilter(value as string)"
          />
          <PersonCreator />
          <Button
            size="icon-lg"
            @click="showMusicControl"
            variant="ghost"
            :class="
              cn(
                'rounded-full',
                'text-green-500',
                isPlaying ? 'text-green-500' : 'text-gray-400',
              )
            "
          >
            <Music class="size-5" />
          </Button>
          <ThemeSwitcher container-class="rounded-full" class="size-5" />
          <Button
            size="icon-lg"
            class="rounded-full"
            variant="destructive-ghost"
            @click="logout"
          >
            <LogOut class="size-5" />
          </Button>
        </div>
      </div>
    </LiquidGlass>
  </Motion>
</template>
