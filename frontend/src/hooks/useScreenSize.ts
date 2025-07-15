import { debounce } from '@/utils/debounce'
import { useEventListener } from '@vueuse/core'
import { computed, readonly, ref } from 'vue'

export function useScreenSize() {
  const screenSize = ref<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0,
  })

  const updateScreenSize = () => {
    screenSize.value.width = window.innerWidth
    screenSize.value.height = window.innerHeight
  }

  updateScreenSize()

  useEventListener(window, 'resize', debounce(updateScreenSize, 100))

  const isMobile = computed(() => {
    return screenSize.value.width < 768
  })

  const isMd = computed(() => {
    return screenSize.value.width >= 768
  })

  const isLg = computed(() => {
    return screenSize.value.width >= 1024
  })

  const isXl = computed(() => {
    return screenSize.value.width >= 1280
  })

  const isDesktop = computed(() => !isMobile.value)

  const getCurrentSize = () => {
    if (isXl.value) return 'xl'
    if (isLg.value) return 'lg'
    if (isMd.value) return 'md'
    if (isMobile.value) return 'mobile'
    return 'desktop'
  }

  return {
    screenSize: readonly(screenSize),
    isMobile,
    isMd,
    isLg,
    isXl,
    isDesktop,
    getCurrentSize,
  }
}
