<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar'
import { RoleBadgeGroup } from '@/components/widgets'
import type { PostPerson } from '@/types/posts'

const props = defineProps<{
  class?: HTMLAttributes['class']
  person?: PostPerson
}>()
</script>

<template>
  <div :class="cn('flex gap-2 items-center', props.class)">
    <Avatar class="size-14">
      <AvatarImage :src="person?.avatar || ''" :alt="person?.name" />
      <AvatarFallback>
        {{ person?.name.slice(0, 1).toUpperCase() }}
      </AvatarFallback>
    </Avatar>
    <div class="flex flex-col gap-1">
      <h3 class="text-lg font-bold">{{ person?.name }}</h3>
      <RoleBadgeGroup
        :role="['creator', 'admin', 'developer', 'designer', 'beta']"
      />
    </div>
  </div>
</template>
