<script setup lang="ts">
import { Model } from '@/components/ui/model'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { UserRoundPlus, ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { useState } from '@/hooks/useState'
import { motion, AnimatePresence, LayoutGroup } from 'motion-v'
import { Verifier, getCreatorSchema, Namer, Extra, Avatar } from './creator'
import { useStep } from '@/hooks/useStep'
import { computed, onMounted, useTemplateRef, ref } from 'vue'
import { fadeMotion } from '@/motions/fade'
import { DotGroup } from '@/components/ui/dot-group'
import { Plus } from 'lucide-vue-next'
import { usePersonnelStore } from '@/store'
import type { PersonCreator } from '@type/personnel'
import { LoadingIcon } from '@/components/ui/loading'
import { sideCannons } from '@/utils/confetti'
import { toast } from 'vue-sonner'
import { calcTodayPsw } from '@/utils/calc-today-psw'
import { __DEV__ } from '@/utils/env'

const personnelStore = usePersonnelStore()
const todayPsw = ref('')

const [visible, setVisible] = useState(false)
const [verified, setVerified] = useState(false)
const [creating, setCreating] = useState(false)

const { currentStep, next, prev, canNext, canPrev, isLastStep, goto } =
  useStep(3)

const creatorRef = useTemplateRef('creatorFormRef')

const schema = computed(() => getCreatorSchema(currentStep.value - 1))

const handleClick = () => setVisible(true)

const handleClickOutside = () => setVisible(false)

const handleVerify = () => {
  setVerified(true)
}

const handleSubmit = async () => {
  if (!creatorRef.value) return
  const data = creatorRef.value.getValues<PersonCreator>()
  setCreating(true)
  try {
    await personnelStore.createPerson(data)
    creatorRef.value.resetForm()
    setVisible(false)
    sideCannons()
    goto(1)
    toast.success('新的兄弟已经添加成功', {
      position: 'top-center',
    })
  } catch (error) {
    console.error('[Person Creator]: ', error)
  } finally {
    setCreating(false)
  }
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
      <motion.div layout-id="person-creator">
        <Button variant="outline" @click="handleClick" class="z-50">
          <motion.div layout-id="person-creator-icon">
            <UserRoundPlus class="size-4" />
          </motion.div>
          <motion.span layout-id="person-creator-title">添加兄弟</motion.span>
        </Button>
      </motion.div>

      <Model :visible="visible" @click:outside="handleClickOutside">
        <LayoutGroup>
          <motion.div
            layout-id="person-creator"
            class="w-md h-fit flex flex-col gap-4 bg-background border rounded-2xl p-4"
            @click.stop
          >
            <div class="flex items-center gap-2">
              <motion.div layout-id="person-creator-icon">
                <UserRoundPlus class="size-5" />
              </motion.div>

              <motion.h2 layout-id="person-creator-title">添加兄弟</motion.h2>
            </div>
            <motion.div v-if="!verified" layout v-bind="fadeMotion">
              <Verifier @pass="handleVerify" :code="todayPsw" />
            </motion.div>
            <motion.div v-else layout v-bind="fadeMotion">
              <Form
                ref="creatorFormRef"
                as=""
                keep-values
                :validation-schema="schema"
                v-slot="{ meta }"
              >
                <motion.div v-if="currentStep === 1" v-bind="fadeMotion">
                  <Namer />
                </motion.div>
                <motion.div v-if="currentStep === 2" v-bind="fadeMotion">
                  <Extra />
                </motion.div>
                <motion.div v-if="currentStep === 3" v-bind="fadeMotion">
                  <Avatar />
                </motion.div>
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
                      v-if="!isLastStep"
                      size="sm"
                      variant="secondary"
                      :disabled="!meta.valid || !canNext"
                      @click="next"
                    >
                      <ChevronRight class="size-4" />
                    </Button>
                    <Button v-else size="sm" @click="handleSubmit">
                      <LoadingIcon v-if="creating" />
                      <Plus v-else class="size-4" />
                      <span>添加</span>
                    </Button>
                  </div>
                </footer>
              </Form>
            </motion.div>
          </motion.div>
        </LayoutGroup>
      </Model>
    </AnimatePresence>
  </div>
</template>
