import { defineComponent, onMounted } from 'vue'
import { Input } from '@/components/ui/input'
import { useState } from '@/hooks/useState'
import { KeyRound } from 'lucide-vue-next'

interface VerifierProps {
  code: string | number
}

type VerifierEmits = {
  pass: () => void
}

const Verifier = defineComponent<VerifierProps, VerifierEmits>(
  (props, { emit }) => {
    const [code, setCode] = useState<string | number>('')
    const validate = () => {
      if (code.value === props.code) {
        emit('pass')
      }
    }

    const handleUpdate = (code: string | number) => {
      setCode(code)
      validate()
    }

    return () => (
      <div class="w-full space-y-6">
        <div class="flex flex-col items-center justify-center gap-2 ">
          <KeyRound class="size-10" />
          <span class="text-sm text-muted-foreground">口令</span>
        </div>
        <Input
          class="w-full h-10"
          // @ts-ignore
          placeholder="你他妈必须知道我们今天的口令"
          modelValue={code.value}
          onUpdate:modelValue={handleUpdate}
        />
      </div>
    )
  },
  {
    props: ['code'],
    emits: ['pass'],
  },
)

export { Verifier }
