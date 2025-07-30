<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { LiquidGlass } from '@/components/ui/liquid-glass'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Motion } from 'motion-v'
import { usePersonnelStore } from '@/store/modules/personnel'
import { ref } from 'vue'
import { debounce } from '@/utils/debounce'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { PersonCreator } from '@/components/personnel'
import { LogOut } from 'lucide-vue-next'
import { removeToken } from '@/utils/token'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const personnelStore = usePersonnelStore()

const filter = ref('')

const handleFilter = debounce((query: string) => {
  personnelStore.filterPersons(query)
}, 200)

function logout() {
  removeToken()
  router.push('/login')
}
</script>

<template>
  <Motion
    :class="cn('z-10', props.class)"
    :initial="{ opacity: 0, y: -100 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{
      type: 'spring',
      delay: 0.8,
    }"
  >
    <LiquidGlass
      container-class="w-full h-16 shadow-lg"
      class="bg-background/20"
    >
      <div class="flex px-4 justify-between items-center size-full">
        <Motion as="h2">欢迎来到不朽堡垒</Motion>
        <div class="flex items-center gap-2">
          <Input
            class="w-32 md:w-64"
            placeholder="搜索兄弟"
            v-model:model-value="filter"
            @update:model-value="(value) => handleFilter(value as string)"
          />
          <PersonCreator />
          <ThemeSwitcher class="size-4" />
          <Button size="icon" variant="ghost" @click="logout">
            <LogOut class="size-4" />
          </Button>
        </div>
      </div>
    </LiquidGlass>
  </Motion>
</template>
