<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Welcome, Main } from './components'
import { Motion, AnimatePresence } from 'motion-v'
import { usePersonnelStore } from '@/store'
import { useTimeoutFn } from '@vueuse/core'
import { useFakeProgress } from '@/hooks/useFakeProgress'

const personnelStore = usePersonnelStore()
const {
  transitionValue,
  start: startProgress,
  finish: finishProgress,
} = useFakeProgress({
  step: 10,
})

const isCeremonyEnd = ref(false)

const fulfilled = computed(() => personnelStore.fulfilled)

const { start } = useTimeoutFn(() => {
  if (!fulfilled.value) return
  isCeremonyEnd.value = true
}, 500)

function fetchPersons() {
  startProgress()
  personnelStore.fetchPersons().then(() => {
    start()
    finishProgress()
  })
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
      <Welcome :progress="transitionValue" />
    </Motion>
    <Main v-else />
  </AnimatePresence>
</template>
