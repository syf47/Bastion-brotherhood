<script setup lang="ts">
import { Motion, AnimatePresence } from 'motion-v'

defineProps<{
  visible: boolean
}>()

const emits = defineEmits<{
  (e: 'click:outside', value: boolean): void
}>()

const handleClickOutside = () => emits('click:outside', false)
</script>

<template>
  <!-- 设置一个不可见的根元素，防止父级使用 `AnimatePresence` 时控制台报错 -->
  <div class="sr-only">
    <Teleport to="body">
      <AnimatePresence>
        <Motion
          v-if="visible"
          as="div"
          class="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          @click="handleClickOutside"
          @keydown.esc="handleClickOutside"
          @wheel.prevent
        >
          <!--
            - 这里理应使用一个 `ModelContent` 组件来包裹内容
            - 以确保模态框的子组件为单一根节点，且可以传递 `update:visible` 事件
            - 但这可能需要额外的测试，暂时不实现
          -->
          <slot />
        </Motion>
      </AnimatePresence>
    </Teleport>
  </div>
</template>
