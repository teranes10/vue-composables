import { describe, expect, it } from 'vitest'
import { getValueByObjectPath } from '../../src/object/getValueByObjectPath'

describe('getValueByObjectPath function', () => {
  it('should retrieve nested value from object', () => {
    const obj = { a: { b: { c: 1 } } }
    const value = getValueByObjectPath(obj, 'a.b.c')

    expect(value).toBe(1)
  })

  it('should return undefined for non-existent path', () => {
    const obj = { a: { b: { c: 1 } } }
    const value = getValueByObjectPath(obj, 'x.y.z')

    expect(value).toBeUndefined()
  })
})
