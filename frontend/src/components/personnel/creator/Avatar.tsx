import { defineComponent, useTemplateRef } from 'vue'
import { Camera } from 'lucide-vue-next'
import { useState } from '@/hooks/useState'
import { toast } from 'vue-sonner'
import { updateAvatar } from '@/api/personnel'
import { LoadingIcon } from '@/components/ui/loading'
import { cn } from '@/lib/utils'
import { usePersonnelStore } from '@/store'

const Avatar = defineComponent(() => {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')

  const personnelStore = usePersonnelStore()

  const fileInputRef = useTemplateRef<HTMLInputElement | null>('fileInputRef')

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

    const id = personnelStore.lastPerson.id

    if (!id) {
      toast.error('无法定位人员')
      return
    }

    try {
      setUploading(true)
      const { avatar_url } = await updateAvatar(id, file)
      setAvatarUrl(avatar_url)
      personnelStore.updatePersonLocal(id, { avatar: avatar_url })
    } catch {
      toast.error('上传失败', {
        description: '请稍后重试',
      })
    } finally {
      setUploading(false)
    }

    const url = URL.createObjectURL(file)
    setAvatarUrl(url)
  }

  function handleClick() {
    fileInputRef.value?.click()
  }

  return () => (
    <div class="space-y-4 w-full flex flex-col items-center justify-center">
      <div class="size-32 rounded-full  p-2 bg-background border shadow-lg">
        <div class="size-full  rounded-full relative bg-secondary">
          {uploading.value && (
            <div class="size-full absolute inset-0 bg-primary rounded-full flex justify-center items-center z-50">
              <LoadingIcon class="size-16 text-primary-foreground" />
            </div>
          )}
          {avatarUrl.value && (
            <img
              src={avatarUrl.value}
              class="size-full rounded-full overflow-hidden object-cover absolute inset-0"
              alt="avatar"
            />
          )}
          <button
            onClick={handleClick}
            class="group absolute inset-0 z-10 cursor-pointer size-full rounded-full flex justify-center items-center hover:bg-primary/80 hover:text-primary-foreground transition-colors"
          >
            <Camera
              class={cn(
                'size-12',
                avatarUrl.value ? 'opacity-0' : 'opacity-100',
                'group-hover:!opacity-100',
              )}
            />
          </button>
        </div>
      </div>
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="sr-only"
        onChange={(e) => handleUpload(e)}
      />
      <div class="flex flex-col items-center">
        <h3 class="text-lgl font-bold">为你的账号添加头像</h3>
        <p class="text-muted-foreground text-sm">
          可选。选择一张2MB以内的图片作为您的头像
        </p>
      </div>
    </div>
  )
})

export { Avatar }
