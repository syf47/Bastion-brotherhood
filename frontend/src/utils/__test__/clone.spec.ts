import { describe, it, expect } from 'vitest'
import { clone, deepClone } from '../clone'

describe('clone', () => {
  it('should clone a primitive value', () => {
    const value = 1
    const cloned = clone(value)
    expect(cloned).toBe(value)
  })

  it('should clone an object', () => {
    const value = { a: 1, b: 2 }
    const cloned = clone(value)
    expect(cloned).toEqual(value)
  })

  it('should clone an array', () => {
    const value = [1, 2, 3]
    const cloned = clone(value)
    expect(cloned).toEqual(value)
  })

  it('should clone a date', () => {
    const value = new Date()
    const cloned = clone(value)
    expect(cloned).toEqual(value)
  })

  it('should clone a function', () => {
    const value = () => {}
    const cloned = clone(value)
    expect(cloned).toEqual(value)
  })

  it('should clone a circular reference', () => {
    const value = { a: 1 }
    // @ts-expect-error
    value.b = value
    const cloned = deepClone(value)
    expect(cloned).toEqual(value)
  })
})
