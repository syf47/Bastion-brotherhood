function noop() {}

function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

const isArray = Array.isArray

export { isFunction, isString, isNumber, isBoolean, isObject, isArray, noop }
