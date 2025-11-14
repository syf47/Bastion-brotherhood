<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { MaskItem } from '.'

type MaskRange = [number, number]

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    leftMask?: MaskRange
    rightMask?: MaskRange
    topMask?: MaskRange
    bottomMask?: MaskRange
  }>(),
  {
    bottomMask: () => [0, 10],
  },
)
</script>

<template>
  <div :class="cn('size-full relative', props.class)">
    <MaskItem
      v-if="leftMask"
      :start="leftMask[0]"
      :end="leftMask[1]"
      direction="right"
      class="z-50 w-1/2 h-full absolute top-0 right-0"
    />
    <MaskItem
      v-if="rightMask"
      :start="rightMask[0]"
      :end="rightMask[1]"
      direction="left"
      class="z-50 w-1/2 h-full absolute top-0 left-0"
    />
    <MaskItem
      v-if="topMask"
      :start="topMask[0]"
      :end="topMask[1]"
      direction="bottom"
      class="z-50 w-full h-1/2 absolute top-0 left-0"
    />
    <MaskItem
      v-if="bottomMask"
      :start="bottomMask[0]"
      :end="bottomMask[1]"
      direction="top"
      class="z-50 w-full h-1/2 absolute bottom-0 left-0"
    />
    <slot />
  </div>
</template>
