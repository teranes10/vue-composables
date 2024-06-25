import { describe, expect, it } from 'vitest'
import { coalesceTruthy } from '../../src/coalesce/coalesceTruthy'

describe('coalesceTruthy function', () => {
  it('should return the first truthy value', () => {
    expect(coalesceTruthy(null, undefined, 0, false, 'test')).toBe('test')
    expect(coalesceTruthy(undefined, null, 'first', 'second')).toBe('first')
    expect(coalesceTruthy(undefined, null)).toBeUndefined()
  })

  it('should fallback to coalesce if no truthy value is found', () => {
    expect(coalesceTruthy(undefined, null, 0, false, '')).toBe(0)
    expect(coalesceTruthy(undefined, null, 0)).toBe(0)
  })
})
