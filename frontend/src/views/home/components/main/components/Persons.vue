<script setup lang="ts">
import { type HTMLAttributes, ref } from 'vue'
import { cn } from '@/lib/utils'
import { usePersonnelStore } from '@/store'
import { PersonInfoCard } from '@/components/personnel'
import type { Person } from '@type/personnel'
import { Motion, LayoutGroup } from 'motion-v'
import { calculateDelta } from './utils'
import { useState } from '@/hooks/useState'
import { useScreenSize } from '@/hooks/useScreenSize'
import hideMods from '@/utils/hideMods'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { isMd, isLg } = useScreenSize()

const personnelStore = usePersonnelStore()

const [animationCompleted, setAnimationCompleted] = useState(false)

const { onHideModeClick } = hideMods()

// await personnelStore.fetchPersons()

const handleSelect = (person: Person) => personnelStore.setActivePerson(person)

const handleClickOutside = () => personnelStore.resetActivePerson()

const getDistance = (index: number) => {
  const colCount = isLg.value ? 4 : isMd.value ? 3 : 1

  const { x, y } = calculateDelta(index, personnelStore.personsCount, colCount)

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
</script>

<template>
  <div class="size-full" :class="{
    'pointer-events-none': !animationCompleted,
  }">
    <div class="hideMode">
      <div class="left" @click="onHideModeClick('left')"></div>
      <div class="right" @click="onHideModeClick('right')"></div>
    </div>
    <LayoutGroup>
      <div :class="cn(
        'grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4 position-relative',
        props.class,
      )
        ">
        <Motion v-for="(person, index) in personnelStore.filteredPersons" :key="person.id" :initial="{
          opacity: 0,
          x: animationCompleted ? 0 : getDistance(index).x * 200,
          y: animationCompleted ? 0 : getDistance(index).y * 100,
        }" :animate="{ opacity: 1, x: 0, y: 0 }" :transition="animationCompleted
          ? undefined
          : {
            type: 'spring',
            delay: getDistance(index).distance * 0.05,
          }
          " layout @animation-complete="handleAnimationComplete" class="positon-relative">
          <PersonInfoCard :person="person" @select="() => handleSelect(person)"
            @click:outside="() => handleClickOutside()" />
        </Motion>
      </div>
    </LayoutGroup>
  </div>
</template>
<style scoped>
.hideMode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  display: flex;
}

.hideMode>.left,
.hideMode>.right {
  flex: 1;
  height: 100%;
  pointer-events: all;
}
</style>