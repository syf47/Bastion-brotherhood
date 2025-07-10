/**
 * shallow clone
 */
function clone<T>(value: T): T {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value !== 'object' && typeof value !== 'function') {
    return value
  }

  if (typeof value === 'function') {
    return value
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T
  }

  if (value instanceof RegExp) {
    const flags = value.flags
    return new RegExp(value.source, flags) as T
  }

  if (value instanceof Map) {
    const clonedMap = new Map()
    value.forEach((val, key) => {
      clonedMap.set(key, val)
    })
    return clonedMap as T
  }

  if (value instanceof Set) {
    const clonedSet = new Set()
    value.forEach((val) => {
      clonedSet.add(val)
    })
    return clonedSet as T
  }

  if (Array.isArray(value)) {
    return value.slice() as T
  }

  if (value instanceof ArrayBuffer) {
    return value.slice(0) as T
  }

  if (value instanceof Int8Array) return new Int8Array(value) as T
  if (value instanceof Uint8Array) return new Uint8Array(value) as T
  if (value instanceof Uint8ClampedArray)
    return new Uint8ClampedArray(value) as T
  if (value instanceof Int16Array) return new Int16Array(value) as T
  if (value instanceof Uint16Array) return new Uint16Array(value) as T
  if (value instanceof Int32Array) return new Int32Array(value) as T
  if (value instanceof Uint32Array) return new Uint32Array(value) as T
  if (value instanceof Float32Array) return new Float32Array(value) as T
  if (value instanceof Float64Array) return new Float64Array(value) as T
  if (value instanceof BigInt64Array) return new BigInt64Array(value) as T
  if (value instanceof BigUint64Array) return new BigUint64Array(value) as T

  if (typeof value === 'object') {
    const cloned = Object.create(Object.getPrototypeOf(value))

    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      cloned[key] = (value as any)[key]
    }

    const symbolKeys = Object.getOwnPropertySymbols(value)
    for (let i = 0; i < symbolKeys.length; i++) {
      const symbolKey = symbolKeys[i]
      const descriptor = Object.getOwnPropertyDescriptor(value, symbolKey)
      if (descriptor && descriptor.enumerable) {
        cloned[symbolKey] = (value as any)[symbolKey]
      }
    }

    return cloned
  }

  return value
}

/**
 * deep clone with map
 */
function deepCloneWithMap<T>(value: T, visited: WeakMap<object, any>): T {
  if (value === null || value === undefined) {
    return value
  }

  if (typeof value !== 'object' && typeof value !== 'function') {
    return value
  }

  if (typeof value === 'function') {
    return value
  }

  if (visited.has(value as object)) {
    return visited.get(value as object)
  }

  if (value instanceof Date) {
    const cloned = new Date(value.getTime()) as T
    visited.set(value as object, cloned)
    return cloned
  }

  if (value instanceof RegExp) {
    const flags = value.flags
    const cloned = new RegExp(value.source, flags) as T
    visited.set(value as object, cloned)
    return cloned
  }

  if (value instanceof Map) {
    const clonedMap = new Map()
    visited.set(value as object, clonedMap)
    value.forEach((val, key) => {
      clonedMap.set(
        deepCloneWithMap(key, visited),
        deepCloneWithMap(val, visited),
      )
    })
    return clonedMap as T
  }

  if (value instanceof Set) {
    const clonedSet = new Set()
    visited.set(value as object, clonedSet)
    value.forEach((val) => {
      clonedSet.add(deepCloneWithMap(val, visited))
    })
    return clonedSet as T
  }

  if (Array.isArray(value)) {
    const clonedArray: any[] = []
    visited.set(value as object, clonedArray)
    for (let i = 0; i < value.length; i++) {
      clonedArray[i] = deepCloneWithMap(value[i], visited)
    }
    return clonedArray as T
  }

  if (value instanceof ArrayBuffer) {
    const cloned = value.slice(0) as T
    visited.set(value as object, cloned)
    return cloned
  }

  if (value instanceof Int8Array) {
    const cloned = new Int8Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Uint8Array) {
    const cloned = new Uint8Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Uint8ClampedArray) {
    const cloned = new Uint8ClampedArray(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Int16Array) {
    const cloned = new Int16Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Uint16Array) {
    const cloned = new Uint16Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Int32Array) {
    const cloned = new Int32Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Uint32Array) {
    const cloned = new Uint32Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Float32Array) {
    const cloned = new Float32Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof Float64Array) {
    const cloned = new Float64Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof BigInt64Array) {
    const cloned = new BigInt64Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }
  if (value instanceof BigUint64Array) {
    const cloned = new BigUint64Array(value) as T
    visited.set(value as object, cloned)
    return cloned
  }

  if (value instanceof Error) {
    const cloned = new (value.constructor as any)(value.message) as T
    visited.set(value as object, cloned)

    if (value.name) (cloned as any).name = value.name
    if (value.stack) (cloned as any).stack = value.stack
    if ('cause' in value)
      (cloned as any).cause = deepCloneWithMap((value as any).cause, visited)

    return cloned
  }

  if (typeof value === 'object') {
    const cloned = Object.create(Object.getPrototypeOf(value))
    visited.set(value as object, cloned)

    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      cloned[key] = deepCloneWithMap((value as any)[key], visited)
    }

    const symbolKeys = Object.getOwnPropertySymbols(value)
    for (let i = 0; i < symbolKeys.length; i++) {
      const symbolKey = symbolKeys[i]
      const descriptor = Object.getOwnPropertyDescriptor(value, symbolKey)
      if (descriptor && descriptor.enumerable) {
        cloned[symbolKey] = deepCloneWithMap((value as any)[symbolKey], visited)
      }
    }

    return cloned
  }

  return value
}

/**
 * deep clone
 */
function deepClone<T>(value: T): T {
  return deepCloneWithMap(value, new WeakMap())
}

/**
 * alias for deepClone function.
 */
function cloneDeep<T>(value: T): T {
  return deepClone(value)
}

export { clone, deepClone, cloneDeep }
