<script setup lang="ts">
import { ScrollArea } from '@ui/scroll-area'
import { PostCard } from '@/components/posts'
import type { Post } from '@/types/posts'
import { usePersonnelStore } from '@/store'
import { onMounted } from 'vue'

const personnelStore = usePersonnelStore()

const posts: Post[] = [
  {
    id: 1,
    title: '关于社区模块的规划与愿景',
    content: `这是一个即将开辟的新模块

我们希望在这个模块中，朋友们可以自由发言、发送帖子、讨论问题甚至是问侯朱博

我希望将它打造成一个相对完整的模块与空间

我希望它可以
 1. 展示用户的身份与勋章
 2. 完整的互动系统
 3. 多媒体
 4. 模拟支付或VIP系统

诚然，这仅仅是设想。

另外，WCNMM!
 `,
    created_at: '2025-11-14 10:00:00',
    updated_at: '2025-11-14 10:00:00',
    author: {
      id: 7,
      name: 'Charles Lee',
      avatar:
        'data:image/jpeg;base64,/9j/2wCEAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSgBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAEAAQAMBIgACEQEDEQH/xAGiAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgsQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+gEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoLEQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2gAMAwEAAhEDEQA/APYIP3UginfJb7jOQC5yTgAegxV3yzuUKox3zSReTcbCUVpkUSBWHzJkfoaju5Sq7oyqSIygrM2BjIyR7849KVwFuN/2RzAT5hGFfbuAPrjuBTI5FmbCgYyASeM8dQKtM+9pol3bmQlcY+mcfWqcc5N4nmRsxYBmKJkq3CjOO2KGwHGLKnC7f9k9qqTxEqcfy6VqZ8yRwFOwdGIwD61SvJViQbyiP/cJyT7Ci/UDEnVgWAjP09Md6zZlDo+5PYDnI9/rWu4bKRtzuUyE5wRz096pXJ3AMMlTxkdPrQncDpra3SWP7QPMWWUqGCLsLEds9fXn0qWTyYF2iJJCDnGflX2GOuKS38x7i5nClEVBHH689T+lS21vmRPMby42ONx7V85m+NrKaw9DTu/U68PSi1zzGrPtbOyJR2VUx+vWiLZECyALHKQGLZLIfT6EZ5ouEjSZxCS654P9axPFt+NJ8Mz3G8iaWRY4/wAPmJrxaGPr4arpK/dXv/XyOv6vGtaKWrL19rESE28DL5inHH3Rjt/9aoIbi4clt+M85VQM+1cJ4b1KOd+QzdD7V6C13bzxxeTGE2rgkHvXNiMZXxMpSq1LW2Wv/DHVPCxw7UFH5jZgt1a3EckSpL5bOHUdcckfpWPIiMFcFhleBkjjHHFaGp3cem6bd3UpAVo2ijz1ZiMAD+tYdqZhpNv57DcYQWIPzDI4r6Hh3E1ailTqO9rHm4ykopTR2+nCIxvCkgVGxtZuMMP/ANdOVWicpIhUnjBU9PWvMYZ7RpBHLDdbmQRkneABxx9Kt6Tf31nqhZLq9XTlGBbuXPzEcMATyB9K6swwSqzjVi9TOhNpNM7HVby30zTZ7++k8q3gHzbcFmPZQPX6155FqsnjW6eS6tNumwEpAiu2UB9cdSeM/WrWtx6VqEivNaXExlfeRI52oT1fH96tTT20Cy8lIBLBFHuYANgSN64zkf1rkwuU01Lmm0dUsV7OPuL3u/YxdH0eKDIuC+mSKpOySNivfkNnByRnmtV/EGmW8cSRAysOVkVW2t+Hf6VX1FRqVqWgXd1CDk7z689a5W806/tsI0Ehlcn7w3bh2wO1Y1cspxm3a68zdYmVbWb1NbV9ag10xieSZJYvlVRGUGPUA8Y+lUo1cSJFC8kxLY2u2MgDoM1Elq2msVmVI5T9/wAk5PH4nH4e9OEhhvP3H7142OTnIf6k9iO1ergMLHDpuO73OLFVue0eiPRPD9xiYN5cJKrnJJJX3961ox5kwZ15LZ/GuLtbloc7UjClR8wJ6/hV+1vnDIVMhGeobP6Gs8bGTqJ9h0EuU6C8gWT5Jo1Yjsw6Vzd9piwTJJsWZd3Tb0/E9a1v7QWNN9wZB+GarX2rWkloy5Lsfu4BU5rlpuopaGzStqZpWGVNohUN164wfaqN7pSg+YAgOBxkk1Ob5UO6PIbuD0zVp9RaaNWnKqijHyuQT+VdE5zW5KjG/umLPDbNCIwiLJ14z/KsGZFSYlIxwem0Cugub5zJmK4l9gDurnLpWaUlnwSea6cO5PWRjWSWx//Z',
    },
  },
]

onMounted(() => {
  personnelStore.tryFetchPersons()
})
</script>

<template>
  <ScrollArea class="size-full">
    <div
      class="size-full flex flex-col gap-4 relative w-full md:max-w-5xl mx-auto p-4"
    >
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </ScrollArea>
</template>
