import { describe, expect, it } from 'vitest'
import { mapper } from './mapper'

// Example class for testing
class ExampleClass {
  prop1: string = ''
  prop2: number = 0
}

describe('mapper function', () => {
  it('should map properties from source to instance', () => {
    const src = { prop1: 'test', prop2: 123 }
    const result = mapper(ExampleClass, src)

    expect(result).toBeInstanceOf(ExampleClass)
    expect(result.prop1).toBe(src.prop1)
    expect(result.prop2).toBe(src.prop2)
  })

  it('should not map properties that are not defined in the class', () => {
    const src = { prop1: 'test', prop2: 123, prop3: 'extra' }
    const result = mapper(ExampleClass, src)

    expect(result).toBeInstanceOf(ExampleClass)
    expect(result.prop1).toBe(src.prop1)
    expect(result.prop2).toBe(src.prop2)
    expect((result as any).prop3).toBeUndefined()
  })

  it('should initialize properties not present in the source as default values', () => {
    const src = { prop1: 'test' }
    const result = mapper(ExampleClass, src)

    expect(result).toBeInstanceOf(ExampleClass)
    expect(result.prop1).toBe(src.prop1)
    expect(result.prop2).toBe(0) // Default value
  })
})
