<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import type { Person } from '@type/personnel'
import { Item } from '@/components/ui/item'
import { cn } from '@/lib/utils'
import { PhoneIcon, MapPinIcon, BriefcaseIcon, MailIcon } from 'lucide-vue-next'
import { WeChatIcon } from '@/components/icons'
import { Motion } from 'motion-v'

interface DetailProps
  extends Pick<Person, 'phone' | 'wechat' | 'email' | 'position' | 'region'> {
  class?: HTMLAttributes['class']
}

const props = defineProps<DetailProps>()

const items = [
  {
    title: '微信',
    class: 'px-4 text-[#5FCE72]',
    description: props.wechat,
    icon: WeChatIcon,
  },
  {
    title: '手机号',
    class: 'px-4',
    description: props.phone,
    icon: PhoneIcon,
  },
  {
    title: '邮箱',
    class: 'px-4',
    description: props.email,
    icon: MailIcon,
  },
  {
    title: '职位',
    class: 'px-4',
    description: props.position,
    icon: BriefcaseIcon,
  },
  {
    title: '地区',
    class: 'px-4',
    description: props.region,
    icon: MapPinIcon,
  },
]
</script>

<template>
  <div :class="cn('flex flex-col gap-2', props.class)">
    <Motion
      v-for="(item, index) in items"
      :key="item.title"
      as-child
      :initial="{ opacity: 0, y: 50 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{
        delay: index * 0.1 + 0.2,
        type: 'spring',
      }"
    >
      <Item
        :class="item.class"
        :title="item.title"
        :description="item.description"
      >
        <template #icon>
          <component :is="item.icon" class="size-4" />
        </template>
      </Item>
    </Motion>
  </div>
</template>
