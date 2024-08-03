import { describe, expect, it } from 'vitest'
import { objectAssign } from '../../src/object/objectAssign'

describe('objectAssign function', () => {
  it('should handle basic assignment without force', () => {
    const target = null
    const src = { a: 1, b: 2 }
    const result = objectAssign(target, src)
    expect(result).toBeUndefined()
  })

  it('should handle basic assignment with force', () => {
    const target = null
    const src = { a: 1, b: 2 }
    const result = objectAssign(target, src, { force: true })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('should update existing properties without force', () => {
    const target = { a: 1, b: 2 }
    const src = { b: 3, c: 4 }
    const result = objectAssign(target, src)
    expect(result).toEqual({ a: 1, b: 3 })
  })

  it('should update existing properties with force', () => {
    const target = { a: 1, b: 2 }
    const src = { b: 3, c: 4 }
    const result = objectAssign(target, src, { force: true })
    expect(result).toEqual({ a: 1, b: 3, c: 4 })
  })

  it('should handle nested object assignment', () => {
    const target = { a: { x: 1, y: 2 }, b: 2 }
    const src = { a: { x: 10, z: 3 }, c: 4 }
    const result = objectAssign(target, src, { force: true })
    expect(result).toEqual({ a: { x: 10, y: 2, z: 3 }, b: 2, c: 4 })
  })

  it('should handle null src', () => {
    const target = { a: 1 }
    const src = null
    const result = objectAssign(target, src)
    expect(result).toEqual(target)
  })

  it('should handle default value', () => {
    const target = { a: 1, b: 1.5 }
    const src = { a: undefined, b: 2, c: 3 }
    const result = objectAssign(target, src, { force: true, ignoreNull: true })
    expect(result).toEqual({ a: 1, b: 2, c: 3 })
  })
})
