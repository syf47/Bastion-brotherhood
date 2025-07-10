<script setup lang="ts">
import { type HTMLAttributes, ref, onMounted, useId, useTemplateRef } from 'vue'
import { cn } from '@/lib/utils'
import { useEventListener } from '@vueuse/core'

interface Props {
  class?: HTMLAttributes['class']
  containerClass?: HTMLAttributes['class']
  borderRadius?: number
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 50,
  scale: 1,
})

const filterId = `liquid-glass-${useId()}`

const width = ref(300)
const height = ref(200)

const canvasRef = useTemplateRef('canvasRef')
const feImageRef = useTemplateRef('feImageRef')
const feDisplacementMapRef = useTemplateRef('feDisplacementMapRef')
const containerRef = useTemplateRef('containerRef')

function smoothStep(a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function length(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

function roundedRectSDF(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): number {
  const qx = Math.abs(x) - width + radius
  const qy = Math.abs(y) - height + radius
  return (
    Math.min(Math.max(qx, qy), 0) +
    length(Math.max(qx, 0), Math.max(qy, 0)) -
    radius
  )
}

function texture(x: number, y: number): { type: string; x: number; y: number } {
  return { type: 't', x, y }
}

// 更新shader
function updateShader() {
  if (!canvasRef.value || !feImageRef.value || !feDisplacementMapRef.value)
    return

  const canvasDPI = 1
  const w = width.value * canvasDPI
  const h = height.value * canvasDPI
  const canvas = canvasRef.value
  const context = canvas.getContext('2d')

  if (!context) return

  canvas.width = w
  canvas.height = h

  const data = new Uint8ClampedArray(w * h * 4)
  let maxScale = 0
  const rawValues: number[] = []

  // Fragment shader
  const fragment = (uv: { x: number; y: number }) => {
    const ix = uv.x - 0.5
    const iy = uv.y - 0.5
    const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6)
    const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15)
    const scaled = smoothStep(0, 1, displacement)
    return texture(ix * scaled + 0.5, iy * scaled + 0.5)
  }

  // 计算位移数据
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % w
    const y = Math.floor(i / 4 / w)
    const pos = fragment({ x: x / w, y: y / h })
    const dx = pos.x * w - x
    const dy = pos.y * h - y
    maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy))
    rawValues.push(dx, dy)
  }

  maxScale *= 0.5

  // 填充像素数据
  let index = 0
  for (let i = 0; i < data.length; i += 4) {
    const r = rawValues[index++] / maxScale + 0.5
    const g = rawValues[index++] / maxScale + 0.5
    data[i] = r * 255
    data[i + 1] = g * 255
    data[i + 2] = 0
    data[i + 3] = 255
  }

  context.putImageData(new ImageData(data, w, h), 0, 0)
  feImageRef.value.setAttributeNS(
    'http://www.w3.org/1999/xlink',
    'href',
    canvas.toDataURL(),
  )
  feDisplacementMapRef.value.setAttribute(
    'scale',
    ((maxScale / canvasDPI) * props.scale).toString(),
  )
}

function updateContainerSize() {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  width.value = rect.width
  height.value = rect.height
  console.log('size', width.value, height.value)
}

useEventListener('resize', updateContainerSize)

onMounted(() => {
  updateShader()
  updateContainerSize()
})
</script>

<template>
  <div
    ref="containerRef"
    :class="cn('overflow-hidden rounded-2xl', props.containerClass)"
  >
    <!-- SVG filter -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      class="fixed top-0 left-0 pointer-events-none"
      style="z-index: -1"
    >
      <defs>
        <filter
          :id="filterId"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
          x="0"
          y="0"
          :width="width"
          :height="height"
        >
          <feImage
            ref="feImageRef"
            :id="`${filterId}_map`"
            :width="width"
            :height="height"
          />
          <feDisplacementMap
            ref="feDisplacementMapRef"
            in="SourceGraphic"
            :in2="`${filterId}_map`"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <!-- 隐藏的canvas用于生成位移贴图 -->
    <canvas ref="canvasRef" class="hidden" :width="width" :height="height" />

    <!-- liquid glass container -->
    <div
      :class="cn('overflow-hidden size-full rounded-2xl border', props.class)"
      :style="{
        // width: `${width}px`,
        // height: `${height}px`,
        // boxShadow: `
        //   0 4px 8px rgba(0, 0, 0, 0.25),
        //   0 -10px 10 inset rgba(0, 0, 0, 0.15),
        //   0 -1px 4px 1px inset rgba(255, 255, 255, 0.74)
        // `,
        backdropFilter: `url(#${filterId}) blur(2px) brightness(1.5) saturate(1.1)`,
      }"
    >
      <slot />
    </div>
  </div>
</template>
