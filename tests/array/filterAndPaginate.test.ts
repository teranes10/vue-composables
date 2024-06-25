import { describe, expect, it } from 'vitest'
import { filterAndPaginate } from '../../src/array/filterAndPaginate'

describe('filterAndPaginate function', () => {
  it('should filter and paginate items', () => {
    const items = ['apple', 'banana', 'grape', 'orange', 'pear']
    const options = { search: 'ap', page: 1, itemsPerPage: 2 }
    const result = filterAndPaginate(items, options)
    expect(result).toEqual({ items: ['apple', 'grape'], totalItems: 2 })
  })

  it('should handle pagination correctly', () => {
    const items = ['apple', 'banana', 'grape', 'orange', 'pear']
    const options = { search: 'a', page: 2, itemsPerPage: 2 }
    const result = filterAndPaginate(items, options)
    expect(result).toEqual({ items: ['grape', 'orange'], totalItems: 5 })
  })

  it('should return an empty array if no items match after filtering', () => {
    const items = ['apple', 'banana', 'grape']
    const options = { search: 'orange', page: 1, itemsPerPage: 2 }
    const result = filterAndPaginate(items, options)
    expect(result).toEqual({ items: [], totalItems: 0 })
  })
})
