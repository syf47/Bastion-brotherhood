<script setup lang="ts">
import { Spline } from '@/components/ui/_spline'
import { BlurInText } from '@/components/ui/blur-in-text'

const sceneUrl = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

const emit = defineEmits(['animation:end'])
const animationEnd = () => {
  emit('animation:end')
}
</script>

<template>
  <div class="relative w-full overflow-hidden bg-black/[0.96]">
    <h2
      class="absolute w-full text-center text-3xl md:text-7xl font-bold text-white pt-18"
    >
      <BlurInText
        words="欢迎来到不朽堡垒"
        mode="pre"
        @animation:end="animationEnd"
      />
    </h2>

    <Spline :scene="sceneUrl" class="mt-24 size-full" />
  </div>
</template>
