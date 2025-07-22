<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { Person } from '@type/personnel'
import { ref, type HTMLAttributes } from 'vue'
import Avatar from './Avatar.vue'
import { motion, AnimatePresence } from 'motion-v'
import { PersonInfoModel } from '.'
import { usePersonnelStore } from '@/store'
import { toast } from 'vue-sonner'

const personnelStore = usePersonnelStore()

const props = defineProps<{
  class?: HTMLAttributes['class']
  person: Person
}>()

const emits = defineEmits<{
  (e: 'select'): void
  (e: 'click:outside'): void
}>()

const visible = ref(false)

const handleClick = () => {
  emits('select')
  visible.value = true
}

const handleModelVisible = () => {
  visible.value = false
  emits('click:outside')
}

const removePerson = async () => {
  // 后续加一个确认删除的确认框 目前点击直接删除了
  try {
    await personnelStore.removePerson(props.person.id)
    toast.success('成员已删除', {
      position: 'top-center',
    })
    visible.value = false
  } catch (error) {
    console.error('[Person Card]: ', error)
  }
}
</script>

<template>
  <AnimatePresence multiple as="div">
    <motion.div
      layout
      :class="
        cn(
          'w-full p-6 rounded-2xl border flex flex-col gap-4 cursor-pointer bg-background overflow-hidden hover:bg-primary/5 transition-colors',
          props.class,
        )
      "
      :layout-id="`person-card-${person.id}`"
      :initial="{
        scale: 1,
      }"
      :while-hover="{
        scale: 1.05,
      }"
      @click="handleClick"
    >
      <div class="flex items-center justify-between gap-4">
        <motion.div :layout-id="`person-avatar-${person.id}`">
          <Avatar class="size-14" :name="person.name" :url="person.avatar" />
        </motion.div>
        <div class="flex flex-col gap-2 items-end overflow-hidden">
          <motion.h3
            :layout-id="`person-name-${person.id}`"
            class="text-lg font-bold truncate w-full text-end pl-5"
          >
            {{ person.name }}
          </motion.h3>
          <div class="flex items-center gap-2 truncate">
            <motion.p
              :layout-id="`person-realname-${person.id}`"
              class="text-sm text-muted-foreground self-end"
            >
              {{ person.realname }}
            </motion.p>
            <motion.p
              :layout-id="`person-id-${person.id}`"
              class="text-sm text-muted-foreground"
            >
              # {{ person.id }}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.div>
    <PersonInfoModel
      :visible="visible"
      :person="person"
      @click:outside="handleModelVisible"
      @remove="removePerson"
    />
  </AnimatePresence>
</template>
