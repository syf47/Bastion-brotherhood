<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Props {
  class?: HTMLAttributes['class']
  url?: string
  name: string
}

const props = defineProps<Props>()
</script>

<template>
  <Avatar :class="cn('', props.class)">
    <AvatarImage :src="url || ''" :alt="name" />
    <AvatarFallback>{{ name.slice(0, 1).toUpperCase() }}</AvatarFallback>
  </Avatar>
</template>
