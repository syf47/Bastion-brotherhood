<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Welcome, Main } from './components'
import { Motion, AnimatePresence } from 'motion-v'
import { usePersonnelStore } from '@/store'
import { useTimeoutFn } from '@vueuse/core'

const personnelStore = usePersonnelStore()

const isCeremonyEnd = ref(false)

const fulfilled = computed(() => personnelStore.fulfilled)

const { start } = useTimeoutFn(() => {
  if (!fulfilled.value) return
  isCeremonyEnd.value = true
}, 500)

onMounted(() => {
  personnelStore.fetchPersons().then(() => {
    start()
  })
})
</script>

<template>
  <AnimatePresence mode="sync" as="div" class="size-full overflow-hidden">
    <Motion
      v-if="!isCeremonyEnd"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      as-child
    >
      <Welcome @animation:end="start" />
    </Motion>
    <Main v-else />
  </AnimatePresence>
</template>
