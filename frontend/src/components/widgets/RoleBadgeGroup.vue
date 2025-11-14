<script setup lang="ts">
import type { RoleBadge as RoleBadgeType } from '@type/personnel'
import RoleBadge from './RoleBadge.vue'
import { computed } from 'vue'

const props = defineProps<{
  role: RoleBadgeType | RoleBadgeType[]
}>()

const roles = computed(() => {
  return Array.isArray(props.role) ? props.role : [props.role]
})
</script>

<template>
  <div class="flex items-center gap-1 flex-wrap">
    <RoleBadge v-for="role in roles" :key="role" :role="role" />
  </div>
</template>
