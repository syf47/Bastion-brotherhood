<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-vue-next'
import type { LucideProps } from 'lucide-vue-next'
import { reactiveOmit } from '@vueuse/core'

interface LoadingIconProps extends /* @vue-ignore */ LucideProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<LoadingIconProps>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <LoaderCircle
    :class="cn('size-4 animate-spin', props.class)"
    v-bind="delegatedProps"
  />
</template>
