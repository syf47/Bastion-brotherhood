<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface ItemProps {
  class?: HTMLAttributes['class']
  title: string
  description?: string | number
  placeholder?: string
}

const props = withDefaults(defineProps<ItemProps>(), {
  placeholder: 'unknown',
})
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center gap-2 p-2 rounded-lg border justify-between',
        props.class,
      )
    "
  >
    <div class="flex items-center gap-2">
      <slot name="icon" />
      <p>{{ props.title }}</p>
    </div>
    <p class="text-sm text-muted-foreground">
      {{ props.description || props.placeholder }}
    </p>
  </div>
</template>
