<script setup lang="ts">
import { PersonGroupSkeleton } from '@/components/personnel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Persons, Banner } from './components'
import { usePersonnelStore } from '@/store'
import { computed } from 'vue'

const personnelStore = usePersonnelStore()

const fulfilled = computed(() => personnelStore.fulfilled)
</script>

<template>
  <ScrollArea class="size-full">
    <div
      class="size-full flex flex-col gap-4 relative w-full md:max-w-7xl mx-auto p-4"
    >
      <Banner v-if="fulfilled" class="sticky top-4" />
      <div class="px-4">
        <Suspense>
          <Persons />
          <template #fallback>
            <PersonGroupSkeleton />
          </template>
        </Suspense>
      </div>
    </div>
  </ScrollArea>
</template>
