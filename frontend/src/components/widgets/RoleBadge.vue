<script setup lang="ts">
import type { RoleBadge } from '@type/personnel'
import { badgeGroupConfig } from './config'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const props = defineProps<{
  role: RoleBadge
}>()

const badge = computed(() =>
  badgeGroupConfig.find((item) => item.role === props.role),
)

const tip = computed(
  () => badge.value?.tip || `这个用户是一个 ${badge.value?.label}`,
)
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <div
          :class="
            cn(
              'flex p-1 px-2 justify-center items-center bg-primary text-primary-foreground rounded-full cursor-pointer',
              badge?.className,
            )
          "
        >
          <component :is="badge?.icon" class="size-3 mr-1 flex justify-center items-center" />
          <span class="text-xs">{{ badge?.label }}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ tip }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
