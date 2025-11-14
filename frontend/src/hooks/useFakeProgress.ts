import { ref, onUnmounted } from 'vue'
import { useTransition } from '@vueuse/core'

interface FakeProgressOptions {
  /**
   * 模拟进度的最大值
   * 当不调用 `finish` 时，进度会每隔 `interval` 毫秒增长，但永远不会到达 `max`
   * @default 90
  */
  max?: number
  /**
   * 每次增长的间隔，单位为 `ms`
   * @default 150
   */
  interval?: number
  /**
   * 每次递增的最大值
   * @default 2
   */
  step?: number
  /**
   * 调用 `finish` 后到达的值
   * @default 100
   */
  finishValue?: number
  /**
   * 过渡持续时间
   * @default 200
   */
  duration?: number
}

export function useFakeProgress(options: FakeProgressOptions = {}) {
  const {
    max = 90,
    interval = 150,
    step = 2,
    finishValue = 100,
    duration = 200,
  } = options

  const progress = ref(0)

  const transitionValue = useTransition(progress, {
    duration,
  })

  let timer: ReturnType<typeof setInterval> | null = null
  let finished = false

  const start = () => {
    if (timer) return

    timer = setInterval(() => {
      if (finished) return

      // 递减增长
      const diff = max - progress.value
      if (diff <= 0) return

      const increment = Math.random() * step * (diff / max)
      progress.value = Math.min(progress.value + increment, max)
    }, interval)
  }

  const finish = () => {
    finished = true
    progress.value = finishValue

    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  const reset = () => {
    finished = false
    progress.value = 0
    start()
  }

  start()

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return {
    progress,
    transitionValue,
    start,
    finish,
    reset,
  }
}
