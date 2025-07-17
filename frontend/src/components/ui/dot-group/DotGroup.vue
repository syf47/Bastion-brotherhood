<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  total: number
  current: number
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="cn('flex justify-center space-x-1.5 max-sm:order-1', props.class)"
  >
    <template v-for="(_, index) in total" :key="index">
      <template v-if="index + 1 === current">
        <slot name="active">
          <div class="h-1.5 w-1.5 rounded-full bg-primary"></div>
        </slot>
      </template>
      <template v-else>
        <slot name="inactive">
          <div class="h-1.5 w-1.5 rounded-full bg-primary opacity-20"></div>
        </slot>
      </template>
    </template>
  </div>
</template>
