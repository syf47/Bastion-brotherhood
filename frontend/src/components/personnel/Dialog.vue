<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const props = defineProps({
  contentText: {
    type: String,
    default: 'cnm 你夠格刪嗎？',
  },
  titleText: {
    type: String,
    default: '你也配删除吗？',
  },
  cancelText: {
    type: String,
    default: '我不配',
  },
  actionText: {
    type: String,
    default: '我想删就删',
  },
})

const emits = defineEmits<{
  (e: 'click:outside'): void
}>()

function handleAction() {
  emits('click:outside')
}
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <slot></slot>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ props.titleText }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ props.contentText }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{{ props.cancelText }}</AlertDialogCancel>
        <AlertDialogAction @click="handleAction">
          {{ props.actionText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
