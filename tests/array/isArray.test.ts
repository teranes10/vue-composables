import { describe, expect, it } from 'vitest'
import { isArray } from '../../src/array/isArray'

describe('isArray function', () => {
  it('should return true for arrays', () => {
    expect(isArray([])).toBe(true)
    expect(isArray([1, 2, 3])).toBe(true)
  })

  it('should return false for non-arrays', () => {
    expect(isArray('string')).toBe(false)
    expect(isArray(123)).toBe(false)
    expect(isArray({})).toBe(false)
  })
})
