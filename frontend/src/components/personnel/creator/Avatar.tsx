import { defineComponent, useTemplateRef } from 'vue'
import { Camera } from 'lucide-vue-next'
import { useState } from '@/hooks/useState'

const Avatar = defineComponent(() => {
  const [avatarUrl, setAvatarUrl] = useState('')

  const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')

  function handleUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) return
      if (file.size > 2 * 1024 * 1024) return

      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
    }
  }

  function handleClick() {
    fileInputRef.value?.click()
  }

  return () => (
    <div class="space-y-4 w-full flex flex-col items-center justify-center">
      <div class="size-32 rounded-full p-2 bg-background border shadow-lg">
        <button
          onClick={handleClick}
          class="cursor-pointer size-full rounded-full bg-secondary flex justify-center items-center hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Camera class="size-12" />
        </button>
      </div>
      <input
        type="file"
        class="sr-only"
        ref={fileInputRef}
        onChange={handleUpload}
      />
      <div class="flex flex-col items-center">
        <h3 class="text-lgl font-bold">上传头像</h3>
        <p class="text-muted-foreground text-sm">选择一张图片作为您的头像</p>
      </div>
    </div>
  )
})

export { Avatar }
