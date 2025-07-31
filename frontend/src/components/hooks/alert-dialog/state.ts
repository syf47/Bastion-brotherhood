import { useState } from '@/hooks/useState'
import type { AnyNormalFunction, Nullable } from '@/utils/types'
import { ref } from 'vue'

type VisibleHandler = Nullable<AnyNormalFunction<[boolean], void>>

const [visible, setVisible] = useState(false)

const [title, setTitle] = useState('')

const [description, setDescription] = useState('')

const [cancelText, setCancelText] = useState('Cancel')

const [actionText, setActionText] = useState('Continue')

const cancelHandler = ref<VisibleHandler>(null)
function setCancelHandler(handler: VisibleHandler) {
  cancelHandler.value = handler
}

const actionHandler = ref<VisibleHandler>(null)
function setActionHandler(handler: VisibleHandler) {
  actionHandler.value = handler
}

const resolvePromise = ref<VisibleHandler>(null)
function setResolvePromise(handler: VisibleHandler) {
  resolvePromise.value = handler
}

// let cancelHandler: Nullable<AnyNormalFunction<[boolean], void>> = null
// function setCancelHandler(
//   handler: Nullable<AnyNormalFunction<[boolean], void>>,
// ) {
//   cancelHandler = handler
// }

// let actionHandler: Nullable<AnyNormalFunction<[boolean], void>> = null
// function setActionHandler(
//   handler: Nullable<AnyNormalFunction<[boolean], void>>,
// ) {
//   actionHandler = handler
// }

// let resolvePromise: Nullable<AnyNormalFunction<[boolean], void>> = null
// function setResolvePromise(
//   handler: Nullable<AnyNormalFunction<[boolean], void>>,
// ) {
//   resolvePromise = handler
// }

function useAlertDialogState() {
  return {
    visible,
    title,
    description,
    cancelText,
    actionText,

    cancelHandler,
    actionHandler,
    resolvePromise,

    setVisible,
    setTitle,
    setDescription,
    setCancelText,
    setActionText,
    setCancelHandler,
    setActionHandler,
    setResolvePromise,
  }
}

export { useAlertDialogState }
