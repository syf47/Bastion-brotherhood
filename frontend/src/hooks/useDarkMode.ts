import { useColorMode, useMouse } from '@vueuse/core'
import { computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

const { x, y } = useMouse()

const useDarkMode = () => {
  const mode = useColorMode()

  const setMode = (newMode: ThemeMode) => {
    if (!document.startViewTransition) {
      mode.value = newMode
      return
    }
    const transition = document.startViewTransition(() => {
      mode.value = newMode
    })
    transition.ready.then(() => {
      const [clientX, clientY] = [x.value, y.value]
      const radius = Math.hypot(
        Math.max(clientX, innerWidth - clientX),
        Math.max(clientY, innerHeight - clientY),
      )
      const clipPath = [
        `circle(0px at ${clientX}px ${clientY}px)`,
        `circle(${radius}px at ${clientX}px ${clientY}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: newMode === 'dark' ? clipPath.reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement:
            newMode === 'dark'
              ? '::view-transition-old(root)'
              : '::view-transition-new(root)',
        },
      )
    })
  }

  const isDark = computed(() => mode.value === 'dark')

  const isLight = computed(() => mode.value === 'light')

  const toggleMode = () => {
    isDark.value ? setMode('light') : setMode('dark')
  }

  return { mode, isDark, isLight, setMode, toggleMode }
}

export { useDarkMode }
