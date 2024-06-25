import { describe, expect, it } from 'vitest'
import { isObject } from '../../src/object/isObject'

describe('isObject function', () => {
  it('should correctly identify objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject([])).toBe(false)
    expect(isObject(null)).toBe(false)
  })
})
