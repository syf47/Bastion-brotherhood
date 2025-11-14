import { defineComponent } from 'vue'
import { LogoWithProgress } from '@/components/ui/logo'

interface Props {
  progress?: number
}

type Emits = {
  'progress:complete': () => void
}

export const Welcome = defineComponent<Props, Emits>(
  (props, { emit }) => {
    const progressComplete = () => {
      emit('progress:complete')
    }

    return () => (
      <div class="size-full flex flex-col items-center justify-center p-4">
        <LogoWithProgress
          progress={props.progress}
          onProgress:complete={progressComplete}
        />
        <p class="text-sm text-muted-foreground -translate-y-2">正在加载中</p>
      </div>
    )
  },
  {
    emits: ['progress:complete'],
  },
)
