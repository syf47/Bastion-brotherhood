import { type Ref, ref } from 'vue'
import { cloneDeep } from '@/utils/clone'
import { isFunction } from '@/utils/general'

/**
 * 创建一个可重置的 ref
 * @param initialValue 初始值或初始值的获取函数
 * @returns 一个包含 ref 和 reset 函数的元组
 */
export function useResettableRef<T>(initialValue: T | (() => T)) {
  const getInitialValue = () =>
    isFunction(initialValue) ? initialValue() : cloneDeep(initialValue)

  const state = ref<T>(getInitialValue()) as Ref<T>

  function reset() {
    state.value = getInitialValue()
  }

  return [state, reset] as const
}
