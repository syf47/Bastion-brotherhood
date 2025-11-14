import { defineComponent, computed } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Persons, Banner } from './components'
import { usePersonnelStore } from '@/store'
import { Mask } from '@/components/ui/mask'

export const Main = defineComponent(() => {
  const personnelStore = usePersonnelStore()

  const fulfilled = computed(() => personnelStore.fulfilled)

  return () => (
    <Mask bottomMask={[0, 30]} class="size-full">
      <ScrollArea class="size-full">
        <div class="size-full flex flex-col gap-4 relative w-full md:max-w-7xl mx-auto p-4">
          <div class="px-4 pb-24">
            <Persons />
          </div>
          {fulfilled.value && <Banner class="fixed bottom-4 left-0 right-0 z-50" />}
        </div>
      </ScrollArea>
    </Mask>
  )
})
