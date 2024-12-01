import { describe, expect, it } from 'vitest'
import { mapValue } from './mapValue'

describe('mapValue function', () => {
  it('should map values of an object', () => {
    const obj = { a: 1, b: 2 }
    const mappedObj = mapValue(obj, value => value * 2)

    expect(mappedObj).toEqual({ a: 2, b: 4 })
  })
})
