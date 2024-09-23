import { describe, expect, it } from 'vitest'
import { getFromStorage } from './getFromStorage'
import { enableMockStorage } from './_mockStorage'

describe('getFromStorage function', () => {
  const mock = enableMockStorage()

  it('should get an item from localStorage', () => {
    mock.instance().testKey = JSON.stringify({ a: 1 })

    expect(getFromStorage('testKey', { a: 0 })).toEqual({ a: 1 })
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey')
  })

  it('should return default value if key does not exist in localStorage', () => {
    expect(getFromStorage('nonExistentKey', { b: 2 })).toEqual({ b: 2 })
    expect(localStorage.getItem).toHaveBeenCalledWith('nonExistentKey')
  })
})
