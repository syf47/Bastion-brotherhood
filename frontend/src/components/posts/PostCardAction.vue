<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { MessageCircle, Heart } from 'lucide-vue-next'
</script>

<template>
  <div class="flex items-center justify-end">
    <div class="flex items-center">
      <Button variant="ghost" size="sm">
        <MessageCircle class="size-4" />
        12
      </Button>
      <Button variant="ghost" size="sm">
        <Heart class="size-4 fill-current" />
        12
      </Button>
    </div>
  </div>
</template>
