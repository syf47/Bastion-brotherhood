import { ref, computed } from 'vue'

function useStep(totalSteps: number = 3) {
  const currentStep = ref(1)

  const isFirstStep = computed(() => currentStep.value === 1)

  const isLastStep = computed(() => currentStep.value === totalSteps)

  const progress = computed(() => (currentStep.value / totalSteps) * 100)

  const next = () => {
    if (!isLastStep.value) {
      currentStep.value++
    }
  }

  const prev = () => {
    if (!isFirstStep.value) {
      currentStep.value--
    }
  }

  const goto = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }

  const reset = () => {
    currentStep.value = 1
  }

  const canNext = computed(() => !isLastStep.value)

  const canPrev = computed(() => !isFirstStep.value)

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    canNext,
    canPrev,
    next,
    prev,
    goto,
    reset,
  }
}

export { useStep }
