import { ref, onMounted, watch, type Ref } from 'vue'
import ColorThief from 'colorthief'

interface UseImageColorsOptions {
  count?: number
}

export function useImageColors(
  imageUrl: Ref<string> | string,
  options: UseImageColorsOptions = {},
) {
  const { count = 3 } = options

  const img = new Image()
  const mainColor = ref<number[] | null>(null)
  const palette = ref<number[][]>([])
  const isLoaded = ref(false)
  const error = ref<Error | null>(null)

  const srcRef = typeof imageUrl === 'string' ? ref(imageUrl) : imageUrl

  // 设置跨域，避免 canvas 报错
  img.crossOrigin = 'anonymous'

  const extractColors = () => {
    try {
      const colorThief = new ColorThief()
      mainColor.value = colorThief.getColor(img)
      palette.value = colorThief.getPalette(img, 6).slice(1, count + 1) // 取3个次要颜色
      isLoaded.value = true
    } catch (err: any) {
      error.value = err
    }
  }

  const loadImage = () => {
    isLoaded.value = false
    error.value = null
    img.src = srcRef.value
  }

  img.onload = () => extractColors()
  img.onerror = () => {
    error.value = new Error('[useImageColor] image load error')
    isLoaded.value = false
  }

  // 自动加载
  onMounted(() => {
    if (srcRef.value) loadImage()
  })

  watch(srcRef, (newVal) => {
    if (newVal) loadImage()
  })

  return {
    mainColor,
    palette,
    isLoaded,
    error,
  }
}
