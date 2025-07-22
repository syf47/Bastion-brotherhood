<script setup lang="ts">
import { computed } from 'vue'
import { motion, AnimatePresence } from 'motion-v'
import { PersonAvatar } from '@/components/personnel'
import type { Person } from '@type/personnel'
import { useImageColors } from '@/hooks/useImageColor'
import { PersonInfoExtra } from '@/components/personnel'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-vue-next'

const props = defineProps<{
  person: Person | null
  visible: boolean
}>()

const emits = defineEmits<{
  (e: 'click:outside', value: boolean): void
  (e: 'remove', value: number): void
}>()

const person = computed(() => props.person)

const handleClickOutside = () => emits('click:outside', false)

const { palette } = useImageColors(props.person!.avatar, {
  count: 2,
})

const bg = computed(() => {
  if (palette.value.length === 0) return 'var(--foreground)'
  return `linear-gradient(to right top, ${palette.value
    ?.map((color) => `rgba(${color.join(',')})`)
    .join(',')})`
})

const removePerson = () => {
  if (!person.value) return
  emits('remove', person.value.id)
}
</script>

<template>
  <div class="sr-only">
    <Teleport to="body">
      <AnimatePresence>
        <motion.div
          v-if="visible && person"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          class="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click="handleClickOutside"
          @keydown.esc="handleClickOutside"
          @wheel.prevent
        >
          <motion.div
            class="rounded-3xl bg-background shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            :layout-id="`person-card-${person.id}`"
            :transition="{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.5,
            }"
            @click.stop
          >
            <div class="flex flex-col size-full">
              <div class="h-32 relative">
                <motion.div
                  :initial="{ opacity: 0 }"
                  :animate="{ opacity: 0.5 }"
                  :exit="{ opacity: 0 }"
                  :transition="{
                    duration: 0.5,
                    ease: 'easeInOut',
                  }"
                  class="absolute inset-0 bg-background/50"
                  :style="{ background: bg }"
                />
                <div class="absolute top-4 right-4">
                  <motion.p
                    :layout-id="`person-id-${person.id}`"
                    class="text-7xl font-bold text-foreground/40"
                  >
                    # {{ person.id }}
                  </motion.p>
                </div>
                <div class="flex items-center gap-2 absolute -bottom-10 left-4">
                  <motion.div :layout-id="`person-avatar-${person.id}`">
                    <PersonAvatar
                      :name="person.name"
                      :url="person.avatar"
                      class="size-20"
                    />
                  </motion.div>
                  <div class="h-16 flex flex-col justify-between">
                    <motion.h3
                      :layout-id="`person-name-${person.id}`"
                      class="text-xl font-bold"
                    >
                      {{ person.name }}
                    </motion.h3>
                    <motion.p
                      :layout-id="`person-realname-${person.id}`"
                      class="text-sm text-muted-foreground"
                    >
                      {{ person.realname }}
                    </motion.p>
                  </div>
                </div>
              </div>
              <PersonInfoExtra
                class="mt-10 p-4"
                :phone="person.phone"
                :wechat="person.wechat"
                :email="person.email"
                :position="person.position"
                :region="person.region"
              />
              <div class="flex justify-end p-4">
                <Button variant="outline" @click="removePerson">
                  <Trash2Icon class="size-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Teleport>
  </div>
</template>
