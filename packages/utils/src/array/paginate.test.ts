import { describe, expect, it } from 'vitest'
import { paginate } from './paginate'

describe('paginate function', () => {
  it('should paginate items correctly', () => {
    const items = ['apple', 'banana', 'grape', 'orange', 'pear']
    const page = 2
    const itemsPerPage = 2
    const result = paginate(items, page, itemsPerPage)
    expect(result).toEqual(['grape', 'orange'])
  })

  it('should handle edge cases', () => {
    const items = ['apple', 'banana', 'grape']
    const page = 2
    const itemsPerPage = 2
    const result = paginate(items, page, itemsPerPage)
    expect(result).toEqual(['grape'])
  })

  it('should return an empty array for out of bounds page', () => {
    const items = ['apple', 'banana', 'grape']
    const page = 3
    const itemsPerPage = 2
    const result = paginate(items, page, itemsPerPage)
    expect(result).toEqual([])
  })
})
