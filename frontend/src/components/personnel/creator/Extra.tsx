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

const Extra = defineComponent(() => {
  return () => (
    <div class="space-y-4">
      <FormField name="phone">
        {{
          default: ({ value, handleChange }: FieldSlotProps<string>) => (
            <FormItem>
              <FormLabel>手机号</FormLabel>
              <FormControl>
                <Input
                  class="w-full"
                  modelValue={value}
                  onUpdate:modelValue={handleChange}
                />
              </FormControl>
              <FormDescription>可选。请输入成员手机号</FormDescription>
              <FormMessage />
            </FormItem>
          ),
        }}
      </FormField>
      <FormField name="wechat">
        {{
          default: ({ value, handleChange }: FieldSlotProps<string>) => (
            <FormItem>
              <FormLabel>微信号</FormLabel>
              <FormControl>
                <Input
                  class="w-full"
                  modelValue={value}
                  onUpdate:modelValue={handleChange}
                />
              </FormControl>
              <FormDescription>可选。请输入成员微信号</FormDescription>
              <FormMessage />
            </FormItem>
          ),
        }}
      </FormField>
      <FormField name="email">
        {{
          default: ({ value, handleChange }: FieldSlotProps<string>) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input
                  class="w-full"
                  modelValue={value}
                  onUpdate:modelValue={handleChange}
                />
              </FormControl>
              <FormDescription>
                可选。请输入邮箱，如：bastion@example.com
              </FormDescription>
              <FormMessage />
            </FormItem>
          ),
        }}
      </FormField>
    </div>
  )
})

export { Extra }
