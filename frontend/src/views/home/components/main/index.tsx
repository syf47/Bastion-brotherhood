import { defineComponent } from 'vue'
import { ScrollArea } from '@ui/scroll-area'
import { Persons } from './components'

export const Main = defineComponent(() => {
  return () => (
    <ScrollArea class="size-full">
      <div class="size-full flex flex-col gap-4 relative w-full md:max-w-7xl mx-auto p-4">
        <div class="px-4 pb-24">
          <Persons />
        </div>
      </div>
    </ScrollArea>
  )
})
