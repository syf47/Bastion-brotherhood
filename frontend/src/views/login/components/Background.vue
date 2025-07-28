<script setup lang="ts">
import { Spline } from '@/components/ui/spline'
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

const splineUrl = new URL(
  '../../../assets/spline/scene.splinecode',
  import.meta.url,
).href

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <Spline :scene="splineUrl" :class="cn('size-full', props.class)" />
</template>
