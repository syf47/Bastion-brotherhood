<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { motion } from 'motion-v'

const props = withDefaults(
  defineProps<{
    words: string
    filter?: boolean
    duration?: number
    delay?: number
    class?: HTMLAttributes['class']
    mode?: 'pre' | 'word'
  }>(),
  { duration: 0.5, delay: 0, filter: true, mode: 'word' },
)

const wordsArray = computed(() =>
  props.mode === 'pre' ? props.words : props.words.split(' '),
)

const emits = defineEmits<{
  (e: 'animation:end'): void
}>()

const animationEnd = () => {
  emits('animation:end')
}
</script>

<template>
  <div :class="cn('leading-snug tracking-wide', props.class)">
    <motion.div
      class="inline-block"
      v-for="(word, idx) in wordsArray"
      :key="word + idx"
      :initial="{
        opacity: 0,
        scale: 1.5,
        filter: props.filter ? 'blur(10px)' : 'none',
      }"
      :animate="{
        opacity: 1,
        scale: 1,
        filter: props.filter ? 'blur(0px)' : 'none',
      }"
      :transition="{
        duration: props.duration,
        delay: props.delay + idx * 0.05,
      }"
      @animation-complete="
        () => {
          if (idx === wordsArray.length - 1) {
            animationEnd()
          }
        }
      "
    >
      {{ word }}{{ mode === 'pre' ? '' : '&nbsp;' }}
    </motion.div>
  </div>
</template>
