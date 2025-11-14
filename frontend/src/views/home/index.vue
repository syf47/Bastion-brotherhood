<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Welcome, Main } from './components'
import { Motion, AnimatePresence } from 'motion-v'
import { usePersonnelStore } from '@/store'
import { useTimeoutFn } from '@vueuse/core'

const personnelStore = usePersonnelStore()

const isCeremonyEnd = ref(false)
const progress = ref(0)

const fulfilled = computed(() => personnelStore.fulfilled)

const { start } = useTimeoutFn(() => {
  if (!fulfilled.value) return
  isCeremonyEnd.value = true
}, 500)

function fetchPersons() {
  personnelStore
    .fetchPersons({
      onDownloadProgress: ({ event }) => {
        progress.value = ((event.loaded ?? 0) / (event.total ?? 0)) * 100
      },
    })
    .then(() => start())
}

onMounted(() => {
  fetchPersons()
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
      <Welcome :progress="progress" />
    </Motion>
    <Main v-else />
  </AnimatePresence>
</template>
