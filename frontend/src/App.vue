<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { RouterView } from 'vue-router'
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

useColorMode()
</script>

<template>
  <div class="h-screen w-full">
    <Toaster />
    <RouterView />
  </div>
</template>
