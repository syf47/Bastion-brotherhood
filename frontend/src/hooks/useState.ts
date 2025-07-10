import { type Ref, ref, readonly } from 'vue'
import { cloneDeep } from '@/utils/clone'
import { isFunction } from '@/utils/general'

type SetStateAction<S> = S | ((prevState: S) => S)

type Dispatch<A> = (value: A) => void

/**
 * useState hook
 * @param initialValue 初始值或初始值的获取函数
 * @returns 一个包含状态值和更新函数的元组
 */
export function useState<S>(initialValue: S | (() => S)) {
  const getInitialValue = () =>
    isFunction(initialValue) ? initialValue() : cloneDeep(initialValue)

  const state = ref<S>(getInitialValue()) as Ref<S>

  function setState(newValue: SetStateAction<S>) {
    if (isFunction(newValue)) {
      state.value = newValue(state.value)
    } else {
      state.value = cloneDeep(newValue)
    }
  }

  return [readonly(state), setState] as [
    Readonly<Ref<S>>,
    Dispatch<SetStateAction<S>>,
  ]
}

/**
 * 带有重置功能的useState
 * @param initialValue 初始值或初始值的获取函数
 * @returns 一个包含状态值、更新函数和重置函数的元组
 */
export function useStateWithReset<S>(initialValue: S | (() => S)) {
  const getInitialValue = () =>
    isFunction(initialValue) ? initialValue() : cloneDeep(initialValue)

  const state = ref<S>(getInitialValue()) as Ref<S>

  function setState(newValue: SetStateAction<S>) {
    if (isFunction(newValue)) {
      state.value = newValue(state.value)
    } else {
      state.value = cloneDeep(newValue)
    }
  }

  function resetState() {
    state.value = getInitialValue()
  }

  return [readonly(state), setState, resetState] as [
    Readonly<Ref<S>>,
    Dispatch<SetStateAction<S>>,
    () => void,
  ]
}
