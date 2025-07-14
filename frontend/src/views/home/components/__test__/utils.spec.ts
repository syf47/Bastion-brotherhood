import { describe, it, expect } from 'vitest'
import { calculateDelta } from '../main/components/utils'

describe('calculateDelta', () => {
  it('should calculate the delta correctly', () => {
    const delta = calculateDelta(0, 10, 4)

    expect(delta)
  })
})
