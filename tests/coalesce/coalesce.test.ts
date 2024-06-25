import { describe, expect, it } from 'vitest'
import { coalesce } from '../../src/coalesce/coalesce'

describe('coalesce function', () => {
  it('should return the first non-nullish value', () => {
    expect(coalesce(null, undefined, 0, false, 'test')).toBe(0)
    expect(coalesce(undefined, null, 'first', 'second')).toBe('first')
    expect(coalesce(undefined, null)).toBeUndefined()
  })
})
