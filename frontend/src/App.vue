<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { RouterView } from 'vue-router'

useColorMode()
</script>

<template>
  <div class="h-screen w-full">
    <RouterView />
  </div>
</template>
