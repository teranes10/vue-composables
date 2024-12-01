import { describe, expect, it } from 'vitest'
import { filter } from './filter'

describe('filter function', () => {
  it('should filter items based on search string', () => {
    const items = ['apple', 'banana', 'grape']
    const search = 'ap'
    const result = filter(items, search)
    expect(result).toEqual(['apple', 'grape'])
  })

  it('should handle case insensitive search', () => {
    const items = ['Apple', 'banana', 'Grape']
    const search = 'ap'
    const result = filter(items, search)
    expect(result).toEqual(['Apple', 'Grape'])
  })

  it('should filter objects based on search string', () => {
    const items = [{ name: 'apple' }, { name: 'banana' }, { name: 'grape' }]
    const search = 'ap'
    const result = filter(items, search)
    expect(result).toEqual([{ name: 'apple' }, { name: 'grape' }])
  })

  it('should return an empty array if no items match', () => {
    const items = ['apple', 'banana', 'grape']
    const search = 'orange'
    const result = filter(items, search)
    expect(result).toEqual([])
  })

  it('should return all items if search string is empty', () => {
    const items = ['apple', 'banana', 'grape']
    const search = ''
    const result = filter(items, search)
    expect(result).toEqual(items)
  })
})
