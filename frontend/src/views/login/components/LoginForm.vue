<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { reactive, toValue } from 'vue'
import { User2, LockKeyhole } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

const emits = defineEmits<{
  (e: 'submit', data: { username: string; password: string }): void
}>()

const form = reactive({
  username: '',
  password: '',
})

function submit() {
  emits('submit', toValue(form))
}
</script>

<template>
  <div class="w-full flex flex-col gap-8">
    <div class="flex flex-col gap-2">
      <div class="flex items-center">
        <User2 class="size-4 mr-2" />
        <span>你寄吧谁啊</span>
      </div>
      <Input
        class="h-12 border-white/10 rounded-xl"
        v-model:model-value="form.username"
        placeholder="Username"
        type="text"
      />
    </div>
    <div class="flex flex-col gap-2">
      <div class="flex items-center">
        <LockKeyhole class="size-4 mr-2" />
        <span>你寄吧谁啊</span>
      </div>
      <Input
        class="h-12 border-white/10 rounded-xl"
        v-model:model-value="form.password"
        placeholder="Password"
        type="password"
      />
    </div>
    <Separator class="bg-white/20" />
    <Button>申请进入堡垒</Button>
  </div>
</template>
