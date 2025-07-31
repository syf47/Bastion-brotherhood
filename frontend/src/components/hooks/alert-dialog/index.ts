import { noop } from '@/utils/general'
import { useAlertDialogState } from './state'

interface UseAlertDialogOptions {
  title: string
  description?: string
  cancelText?: string
  actionText?: string
  onAction?: () => void
  onCancel?: () => void
}

function showAlert(option: UseAlertDialogOptions) {
  const {
    title,
    description = '',
    cancelText = '取消',
    actionText = '确定',
    onAction = noop,
    onCancel = noop,
  } = option

  const {
    setTitle,
    setActionHandler,
    setActionText,
    setCancelHandler,
    setCancelText,
    setVisible,
    setDescription,
    setResolvePromise,
  } = useAlertDialogState()

  setTitle(title)
  setActionText(actionText)
  setCancelText(cancelText)
  setDescription(description)

  setActionHandler(onAction)
  setCancelHandler(onCancel)

  setVisible(true)

  return new Promise((resolve) => {
    setResolvePromise(resolve)
  })
}

export type { UseAlertDialogOptions }

export { showAlert }

export * from './component'
