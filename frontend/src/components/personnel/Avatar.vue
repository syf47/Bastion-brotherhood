<script setup lang="ts">
import { useTemplateRef, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera } from 'lucide-vue-next'
import { useState } from '@/hooks/useState'
import { toast } from 'vue-sonner'
import { updateAvatar } from '@/api/personnel'
import { usePersonnelStore } from '@/store'
import { LoadingIcon } from '../ui/loading'

interface Props {
  class?: HTMLAttributes['class']
  url?: string
  name: string
  userId?: number
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
})

const [uploading, setUploading] = useState(false)

const fileInputRef = useTemplateRef('fileInputRef')

const personnelStore = usePersonnelStore()

function handleClick() {
  fileInputRef.value?.click()
}

async function handleUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('只能选择图片')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    toast.error('图片大小不能超过2MB')
    return
  }

  const id = props.userId

  if (!id) {
    toast.error('无法定位人员')
    return
  }

  try {
    setUploading(true)
    await updateAvatar(id, file)
    const url = URL.createObjectURL(file)
    personnelStore.updatePersonLocal(id, { avatar: url })
  } catch {
    toast.error('上传失败', {
      description: '请稍后重试',
    })
  } finally {
    setUploading(false)
  }
}
</script>

<template>
  <div
    class="relative rounded-full overflow-hidden"
    :class="{
      'pointer-events-none': !editable,
    }"
  >
    <Avatar :class="cn('', props.class)">
      <AvatarImage :src="url || ''" :alt="name" />
      <AvatarFallback>{{ name.slice(0, 1).toUpperCase() }}</AvatarFallback>
    </Avatar>
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="sr-only"
      @change="(e) => handleUpload(e)"
    />
    <button
      @click="handleClick"
      :class="[
        'absolute inset-0 z-10 ',
        'cursor-pointer ',
        'size-full rounded-full opacity-0',
        'flex justify-center items-center',
        'bg-foreground/80 text-background',
        'hover:opacity-100 transition-opacity',
      ]"
    >
      <Camera class="size-10" />
    </button>

    <div
      v-if="uploading"
      class="size-full flex items-center justify-center absolute inset-0"
    >
      <LoadingIcon class="size-10" />
    </div>
  </div>
</template>
