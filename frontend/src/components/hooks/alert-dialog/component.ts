import { defineComponent, h } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAlertDialogState } from './state'

const AlertDialogProvider = defineComponent(() => {
  const {
    visible,
    title,
    description,
    cancelText,
    actionText,
    cancelHandler,
    actionHandler,
    resolvePromise,
    setResolvePromise,
    setVisible,
  } = useAlertDialogState()

  function handleClose(confirm: boolean) {
    if (confirm) {
      actionHandler.value?.(confirm)
    }
    if (!confirm) {
      cancelHandler.value?.(confirm)
    }
    if (resolvePromise.value) {
      resolvePromise.value(confirm)
      setResolvePromise(null)
    }
    setVisible(false)
  }

  return () =>
    h(
      AlertDialog,
      {
        open: visible.value,
      },
      () =>
        h(AlertDialogContent, null, () => [
          h(AlertDialogHeader, null, () => [
            h(AlertDialogTitle, null, () => title.value),
            h(AlertDialogDescription, null, () => description.value),
          ]),
          h(AlertDialogFooter, null, () => [
            h(
              AlertDialogCancel,
              { onClick: () => handleClose(false) },
              () => cancelText.value,
            ),
            h(
              AlertDialogAction,
              { onClick: () => handleClose(true) },
              () => actionText.value,
            ),
          ]),
        ]),
    )
})

export { AlertDialogProvider }
