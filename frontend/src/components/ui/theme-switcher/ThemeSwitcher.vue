<script setup lang="ts">
import { useDarkMode } from '@/hooks/useDarkMode'
import { Button } from '@/components/ui/button'
import { Moon, Sun } from 'lucide-vue-next'
import { type HTMLAttributes } from 'vue'

const { toggleMode, isLight } = useDarkMode()

interface Props {
  containerClass?: HTMLAttributes['class']
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>
<template>
  <Button
    :class="props.containerClass"
    size="icon"
    variant="ghost"
    @click="toggleMode"
  >
    <Moon v-if="isLight" :class="props.class" />
    <Sun v-else :class="props.class" />
  </Button>
</template>
