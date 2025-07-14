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

  useEventListener(window, 'resize', updateScreenSize)

  const isMobile = computed(() => {
    return screenSize.value.width < 768
  })

  const isDesktop = computed(() => !isMobile.value)

  return {
    screenSize: readonly(screenSize),
    isMobile,
    isDesktop,
  }
}
