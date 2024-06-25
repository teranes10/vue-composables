import { describe, expect, it } from 'vitest'
import { setValueByObjectPath } from '../../src/object/setValueByObjectPath'

describe('setValueByObjectPath function', () => {
  it('should set value at a dot-separated path in an object', () => {
    const obj = { a: { b: {} } }
    setValueByObjectPath(obj, 'a.b.c', 123)

    expect(obj).toEqual({ a: { b: { c: 123 } } })
  })
})
