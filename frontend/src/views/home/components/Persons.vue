<script setup lang="ts">
import { type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { usePersonnelStore } from '@/store'
import { PersonInfoCard } from '@/components/personnel'
import type { Person } from '@type/personnel'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const personnelStore = usePersonnelStore()

await personnelStore.fetchPersons()

const handleSelect = (person: Person) => personnelStore.setActivePerson(person)

const handleClickOutside = () => personnelStore.resetActivePerson()
</script>

<template>
  <div :class="cn('grid md:grid-cols-4 grid-cols-1 gap-4', props.class)">
    <PersonInfoCard
      v-for="person in personnelStore.filteredPersons"
      :key="person.id"
      :person="person"
      @select="() => handleSelect(person)"
      @click:outside="() => handleClickOutside()"
    />
  </div>
</template>
