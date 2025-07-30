<script setup lang="ts">
import { Spline } from '@/components/ui/spline'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/lib/utils'
import { computed, type HTMLAttributes } from 'vue'

const { mode } = useDarkMode()

const splineUrl = computed(() => {
  return new URL(
    `../../../assets/spline/scene.${mode.value}.splinecode`,
    import.meta.url,
  ).href
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Spline
    :scene="splineUrl"
    :class="cn('size-full bg-background', props.class)"
  />
</template>
