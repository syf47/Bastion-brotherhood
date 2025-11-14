<script setup lang="ts">
import { Model } from '@/components/ui/model'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserRoundPlus, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useState } from '@/hooks/useState'
import { Motion, AnimatePresence, LayoutGroup } from 'motion-v'
import { Verifier, getCreatorSchema, Namer, Extra, Avatar } from './creator'
import { useStep } from '@/hooks/useStep'
import { computed, onMounted, useTemplateRef, ref } from 'vue'
import { fadeMotion } from '@/motions/fade'
import { DotGroup } from '@/components/ui/dot-group'
import { Plus } from 'lucide-vue-next'
import { usePersonnelStore } from '@store'
import type { PersonCreator } from '@type/personnel'
import { sideCannons } from '@/utils/confetti'
import { toast } from 'vue-sonner'
import { calcTodayPsw } from '@/utils/calc-today-psw'
import { __DEV__ } from '@/utils/env'

const personnelStore = usePersonnelStore()
const todayPsw = ref('')

const [visible, setVisible] = useState(false)
const [verified, setVerified] = useState(false)
const [creating, setCreating] = useState(false)

const { currentStep, canPrev, goto, next, prev } = useStep(3)

const creatorRef = useTemplateRef('creatorFormRef')

const schema = computed(() => getCreatorSchema(currentStep.value - 1))

const handleClick = () => setVisible(true)

const handleClickOutside = () => setVisible(false)

const handleVerify = () => setVerified(true)

function closeCreator() {
  setVisible(false)
  setVerified(false)
  goto(1)
}

async function create() {
  if (!creatorRef.value) return
  const data = creatorRef.value.getValues<PersonCreator>()
  setCreating(true)
  try {
    await personnelStore.createPerson(data)
    creatorRef.value.resetForm()
    sideCannons()
    next()
    toast.success('新的兄弟已经添加成功', {
      position: 'top-center',
    })
  } catch (error) {
    console.error('[Person Creator]: ', error)
  } finally {
    setCreating(false)
  }
}

function complete() {
  closeCreator()
}

onMounted(async () => {
  todayPsw.value = await calcTodayPsw()
})
</script>

<template>
  <div
    id="person-creator-banner-btn"
    :class="{
      hideMod: !__DEV__,
    }"
  >
    <AnimatePresence>
      <Motion layout-id="person-creator">
        <Button
          size="icon-lg"
          variant="ghost"
          @click="handleClick"
          class="z-50 rounded-full"
        >
          <Motion layout-id="person-creator-icon">
            <UserRoundPlus class="size-5" />
          </Motion>
        </Button>
      </Motion>

      <Model :visible="visible" @click:outside="handleClickOutside">
        <LayoutGroup>
          <Motion
            layout
            layout-id="person-creator"
            class="w-md h-fit flex flex-col gap-4 bg-background border rounded-2xl p-4 shadow-2xl"
            @click.stop
          >
            <div class="flex items-center gap-2">
              <Motion layout-id="person-creator-icon">
                <UserRoundPlus class="size-5" />
              </Motion>

              <Motion as="h2" layout-id="person-creator-title">添加兄弟</Motion>
            </div>
            <Motion v-if="!verified && !__DEV__" layout v-bind="fadeMotion">
              <Verifier @pass="handleVerify" :code="todayPsw" />
            </Motion>
            <Motion v-else layout v-bind="fadeMotion">
              <Form
                ref="creatorFormRef"
                as=""
                keep-values
                :validation-schema="schema"
                v-slot="{ meta }"
              >
                <Motion v-if="currentStep === 1" v-bind="fadeMotion">
                  <Namer />
                </Motion>
                <Motion v-if="currentStep === 2" v-bind="fadeMotion">
                  <Extra />
                </Motion>
                <Motion v-if="currentStep === 3" v-bind="fadeMotion">
                  <Avatar />
                </Motion>
                <footer class="flex justify-between items-center mt-4">
                  <DotGroup :total="2" :current="currentStep" />
                  <div class="flex items-center gap-2 max-sm:order-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      :disabled="!canPrev"
                      @click="prev"
                    >
                      <ChevronLeft class="size-4" />
                    </Button>
                    <Button
                      v-if="currentStep === 1"
                      size="sm"
                      variant="secondary"
                      :disabled="!meta.valid"
                      @click="next"
                    >
                      <ChevronRight class="size-4" />
                    </Button>
                    <Button
                      v-if="currentStep === 2"
                      :loading="creating"
                      size="sm"
                      @click="create"
                    >
                      <Plus v-if="!creating" class="size-4" />
                      <span>添加</span>
                    </Button>
                    <Button
                      v-if="currentStep === 3"
                      size="sm"
                      @click="complete"
                    >
                      <span>完成</span>
                    </Button>
                  </div>
                </footer>
              </Form>
            </Motion>
          </Motion>
        </LayoutGroup>
      </Model>
    </AnimatePresence>
  </div>
</template>
