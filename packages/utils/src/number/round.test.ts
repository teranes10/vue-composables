import { describe, expect, it } from 'vitest'
import { round } from './round'

describe('round function', () => {
  it('should round numbers correctly without precision', () => {
    expect(round(3.14159)).toBe(3)
    expect(round(3.5)).toBe(4)
    expect(round(3.14)).toBe(3)
  })

  it('should round numbers correctly with precision', () => {
    expect(round(3.14159, 2)).toBe(3.14)
    expect(round(1.23456789, 3)).toBe(1.235)
  })

  it('should handle zero precision correctly', () => {
    expect(round(3.14159, 0)).toBe(3)
    expect(round(123.456, 0)).toBe(123)
  })

  it('should handle negative precision correctly', () => {
    expect(round(12345.6789, -2)).toBe(12300)
    expect(round(9876.54321, -3)).toBe(10000)
  })

  it('should return NaN for non-numeric inputs', () => {
    expect(round('abc' as any)).toBeNaN()
    expect(round(null as any)).toBeNaN()
    expect(round(undefined as any)).toBeNaN()
  })
})
