import { describe, expect, it } from 'vitest'
import { setToStorage } from '../../src/local-storage/setToStorage'
import { enableMockStorage } from '../_mock/mockStorage'

describe('setToStorage function', () => {
  const mock = enableMockStorage()

  it('should set an item to localStorage', () => {
    setToStorage('testKey', { a: 1 })
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ a: 1 }))
    expect(mock.instance()).toEqual({ testKey: JSON.stringify({ a: 1 }) })
  })
})
