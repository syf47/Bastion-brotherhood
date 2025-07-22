import { defineComponent } from 'vue'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { FieldSlotProps } from 'vee-validate'

const Namer = defineComponent(() => {
  return () => (
    <div class="space-y-4">
      <FormField name="name">
        {{
          default: ({ value, handleChange }: FieldSlotProps<string>) => (
            <FormItem>
              <FormLabel>姓名</FormLabel>
              <FormControl>
                <Input
                  class="w-full"
                  modelValue={value}
                  onUpdate:modelValue={handleChange}
                />
              </FormControl>
              <FormDescription>
                请输入成员昵称，如：一只可爱的科莫多巨蜥
              </FormDescription>
              <FormMessage />
            </FormItem>
          ),
        }}
      </FormField>
      <FormField name="realname">
        {{
          default: ({ value, handleChange }: FieldSlotProps<string>) => (
            <FormItem>
              <FormLabel>真实姓名</FormLabel>
              <FormControl>
                <Input
                  class="w-full"
                  modelValue={value}
                  onUpdate:modelValue={handleChange}
                />
              </FormControl>
              <FormDescription>请输入成员真实姓名，如：朱永博</FormDescription>
              <FormMessage />
            </FormItem>
          ),
        }}
      </FormField>
    </div>
  )
})

export { Namer }
