<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Mask } from '@ui/mask'
import { Banner } from './components'
import { usePersonnelStore } from '@/store'
import { computed } from 'vue'

const personnelStore = usePersonnelStore()
const fulfilled = computed(() => personnelStore.fulfilled)
</script>

<template>
  <Mask :bottomMask="[0, 20]" class="size-full">
    <RouterView />
    <Banner v-if="fulfilled" class="fixed bottom-4 left-0 right-0 z-50" />
  </Mask>
</template>
