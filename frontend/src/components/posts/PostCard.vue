<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import PostCardHeader from './PostCardHeader.vue'
import PostCardAction from './PostCardAction.vue'
import type { Post } from '@/types/posts'

const props = defineProps<{
  class?: HTMLAttributes['class']
  post: Post
}>()
</script>

<template>
  <div :class="cn('w-full p-4 rounded-2xl border shadow', props.class)">
    <PostCardHeader :person="post.author" />
    <div class="flex flex-col gap-2 mt-4">
      <h3 class="font-bold">{{ post.title }}</h3>
      <pre class="text-sm">{{ post.content }}</pre>
    </div>
    <PostCardAction />
  </div>
</template>
