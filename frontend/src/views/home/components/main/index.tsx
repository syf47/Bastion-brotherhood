import { defineComponent, computed, Suspense } from 'vue'
import { PersonGroupSkeleton } from '@/components/personnel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Persons, Banner } from './components'
import { usePersonnelStore } from '@/store'

export const Main = defineComponent(() => {
  const personnelStore = usePersonnelStore()

  const fulfilled = computed(() => personnelStore.fulfilled)

  return () => (
    <ScrollArea class="size-full">
      <div class="size-full flex flex-col gap-4 relative w-full md:max-w-7xl mx-auto p-4">
        {fulfilled && <Banner class="sticky top-4" />}
        <div class="px-4">
          <Suspense>
            {{
              default: () => <Persons />,
              fallback: () => <PersonGroupSkeleton />,
            }}
          </Suspense>
        </div>
      </div>
    </ScrollArea>
  )
})
