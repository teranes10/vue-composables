import { describe, expect, it } from 'vitest'
import { cloneDeep } from './cloneDeep'

describe('cloneDeep function', () => {
  it('should create a deep clone of an object', () => {
    const obj = { a: { b: 1 } }
    const clonedObj = cloneDeep(obj)

    expect(clonedObj).toEqual(obj)
    expect(clonedObj).not.toBe(obj) // Ensure it's a deep clone
  })
})
