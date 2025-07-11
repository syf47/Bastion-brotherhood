<script setup lang="ts">
import { type HTMLAttributes, ref } from 'vue'
import { cn } from '@/lib/utils'
import { usePersonnelStore } from '@/store'
import { PersonInfoCard } from '@/components/personnel'
import type { Person } from '@type/personnel'
import { Motion, LayoutGroup } from 'motion-v'
import { calculateDelta } from './utils'
import { useState } from '@/hooks/useState'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const personnelStore = usePersonnelStore()

const [animationCompleted, setAnimationCompleted] = useState(false)

await personnelStore.fetchPersons()

const handleSelect = (person: Person) => personnelStore.setActivePerson(person)

const handleClickOutside = () => personnelStore.resetActivePerson()

const getDistance = (index: number) => {
  const { x, y } = calculateDelta(index, personnelStore.personsCount, 4)

  const distance = Math.sqrt(x ** 2 + y ** 2).toFixed(2)

  return {
    x,
    y,
    distance: Number(distance),
  }
}

const handleAnimationComplete = () => {
  setAnimationCompleted(true)
}

const handleAnimationStart = () => {
  setAnimationCompleted(false)
}
</script>

<template>
  <div
    class="size-full"
    :class="{
      'pointer-events-none': !animationCompleted,
    }"
  >
    <LayoutGroup>
      <div :class="cn('grid md:grid-cols-4 grid-cols-1 gap-4', props.class)">
        <Motion
          v-for="(person, index) in personnelStore.filteredPersons"
          :key="person.id"
          :initial="{
            opacity: 0,
            x: animationCompleted ? 0 : getDistance(index).x * 200,
            y: animationCompleted ? 0 : getDistance(index).y * 100,
          }"
          :animate="{ opacity: 1, x: 0, y: 0 }"
          :transition="
            animationCompleted
              ? undefined
              : {
                  type: 'spring',
                  delay: getDistance(index).distance * 0.05,
                }
          "
          layout
          @animation-complete="handleAnimationComplete"
        >
          <PersonInfoCard
            :person="person"
            @select="() => handleSelect(person)"
            @click:outside="() => handleClickOutside()"
          />
        </Motion>
      </div>
    </LayoutGroup>
  </div>
</template>
