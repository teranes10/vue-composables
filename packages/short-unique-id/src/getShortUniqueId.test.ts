import { describe, expect, it } from 'vitest'
import { getShortUniqueId } from './getShortUniqueId'

describe('getUniqueId function', () => {
  it('should generate a unique ID', () => {
    const id = getShortUniqueId()
    expect(id).not.toBeUndefined()
  })

  it('should generate a unique ID of specified length', () => {
    const id = getShortUniqueId(10)
    expect(id).lengthOf(10)
  })

  it('should generate different unique IDs on multiple calls', () => {
    const ids: string[] = []
    for (let i = 0; i < 1000; i++) {
      const id = getShortUniqueId()
      expect(ids).not.includes(id)
      ids.push(id)
    }
  })
})
