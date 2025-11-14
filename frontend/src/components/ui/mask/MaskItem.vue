<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    start?: number
    end?: number
    direction?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    start: 0,
    end: 10,
    direction: 'top',
  },
)
</script>

<template>
  <div
    :class="cn('size-full pointer-events-none', props.class)"
    :style="{
      backgroundImage: `linear-gradient(to ${direction}, var(--color-background) ${start}%, transparent ${end}%)`,
    }"
  ></div>
</template>
