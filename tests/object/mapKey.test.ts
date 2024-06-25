import { describe, expect, it } from 'vitest'
import { mapKey } from '../../src/object/mapKey'

describe('mapKey function', () => {
  it('should map keys of an object', () => {
    const obj = { a: 1, b: 2 }
    const mappedObj = mapKey(obj, key => `new_${key}`)

    expect(mappedObj).toEqual({ new_a: 1, new_b: 2 })
  })
})
