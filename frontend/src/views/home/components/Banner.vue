<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { Input } from '@/components/ui/input'
import { Motion } from 'motion-v'
import { usePersonnelStore } from '@/store/modules/personnel'
import { ref } from 'vue'
import { debounce } from '@/utils/debounce'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const personnelStore = usePersonnelStore()

const filter = ref('')

const handleFilter = debounce((query: string) => {
  personnelStore.filterPersons(query)
}, 200)
</script>

<template>
  <Motion
    :class="cn('z-10', props.class)"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{
      type: 'spring',
    }"
  >
    <LiquidGlass
      container-class="w-full h-16 shadow-lg"
      class="bg-background/20"
    >
      <div class="flex px-4 justify-between items-center size-full">
        <h2>欢迎来到不朽堡垒！</h2>
        <div class="flex items-center gap-2">
          <Input
            class="w-64"
            placeholder="搜索堡垒成员"
            v-model:model-value="filter"
            @update:model-value="(value) => handleFilter(value as string)"
          />
          <ThemeSwitcher class="size-4" />
        </div>
      </div>
    </LiquidGlass>
  </Motion>
</template>
