import { defineComponent } from 'vue'
import { motion } from 'motion-v'
import { BlurInText } from '@/components/ui/blur-in-text'

type Emits = {
  'animation:end': () => void
}

export const Welcome = defineComponent<{}, Emits>(
  (_, { emit }) => {
    const animationEnd = () => {
      emit('animation:end')
    }

    return () => (
      <div class="size-full flex items-center justify-center p-4">
        <motion.h1 layoutId="slogan" class="text-3xl md:text-7xl font-bold">
          <BlurInText
            words="欢迎来到不朽堡垒"
            mode="pre"
            onAnimation:end={animationEnd}
          />
        </motion.h1>
      </div>
    )
  },
  {
    emits: ['animation:end'],
  },
)
