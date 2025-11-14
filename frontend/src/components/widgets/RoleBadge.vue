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
          <component :is="badge?.icon" class="size-3 mr-1" />
          <span class="text-xs">{{ badge?.label }}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>这个用户是一个 {{ badge?.label }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
