/**
 * 防抖函数选项
 */
export interface DebounceOptions {
  /**
   * 是否立即执行，默认为 false
   * true: 立即执行第一次调用，然后在指定时间内忽略后续调用
   * false: 延迟执行，等待指定时间后执行最后一次调用
   */
  immediate?: boolean
}

/**
 * 防抖函数返回值类型
 */
export interface DebouncedFunction<T extends (...args: any[]) => any> {
  /**
   * 防抖后的函数
   */
  (...args: Parameters<T>): void
  /**
   * 取消防抖
   */
  cancel: () => void
  /**
   * 立即执行
   */
  flush: () => ReturnType<T> | undefined
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @param options 防抖选项
 * @returns 防抖后的函数
 *
 * @example
 * ```typescript
 * // 延迟执行防抖
 * const debouncedFn = debounce(() => {
 *   console.log('执行了');
 * }, 300);
 *
 * // 立即执行防抖
 * const debouncedFn2 = debounce(() => {
 *   console.log('立即执行');
 * }, 300, { immediate: true });
 *
 * // 取消防抖
 * debouncedFn.cancel();
 *
 * // 立即执行
 * debouncedFn.flush();
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const { immediate = false } = options

  let timeout: ReturnType<typeof setTimeout> | null = null
  let result: ReturnType<T> | undefined

  const debounced = function (this: any, ...args: Parameters<T>) {
    const callNow = immediate && !timeout

    // 清除之前的定时器
    if (timeout) {
      clearTimeout(timeout)
    }

    // 设置新的定时器
    timeout = setTimeout(() => {
      timeout = null
      // 如果不是立即执行，在延迟后执行函数
      if (!immediate) {
        result = func.apply(this, args)
      }
    }, wait)

    // 如果是立即执行且当前没有定时器，立即执行函数
    if (callNow) {
      result = func.apply(this, args)
    }
  }

  // 取消防抖
  debounced.cancel = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  // 立即执行
  debounced.flush = function () {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      result = func.apply(this, [])
    }
    return result
  }

  return debounced as DebouncedFunction<T>
}

/**
 * 创建一个防抖包装器
 * @param wait 等待时间（毫秒）
 * @param options 防抖选项
 * @returns 防抖装饰器函数
 *
 * @example
 * ```typescript
 * const debounceDecorator = createDebounce(300);
 *
 * const debouncedFn = debounceDecorator(() => {
 *   console.log('执行了');
 * });
 * ```
 */
export function createDebounce(wait: number, options: DebounceOptions = {}) {
  return function <T extends (...args: any[]) => any>(
    func: T,
  ): DebouncedFunction<T> {
    return debounce(func, wait, options)
  }
}

export default debounce
