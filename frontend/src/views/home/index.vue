<script setup lang="ts">
import { PersonGroupSkeleton } from '@/components/personnel'
import { Persons, Banner } from './components'
</script>

<template>
  <div
    class="size-full flex flex-col gap-4 relative w-full md:max-w-7xl mx-auto p-4"
  >
    <Banner class="sticky top-4" />
    <div class="px-4">
      <Suspense>
        <Persons />
        <template #fallback>
          <PersonGroupSkeleton />
        </template>
      </Suspense>
    </div>
  </div>
</template>
