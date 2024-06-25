import { describe, expect, it } from 'vitest'
import { getUniqueId } from '../../src/unique/getUniqueId'

describe('getUniqueId function', () => {
  it('should generate a unique ID', () => {
    const id = getUniqueId()
    expect(id).not.toBeUndefined()
  })

  it('should generate a unique ID of specified length', () => {
    const id = getUniqueId(10)
    expect(id).lengthOf(10)
  })

  it('should generate different unique IDs on multiple calls', () => {
    const ids: string[] = []
    for (let i = 0; i < 1000; i++) {
      const id = getUniqueId()
      expect(ids).not.includes(id)
      ids.push(id)
    }
  })
})
