import { describe, expect, it } from 'vitest'
import { setToStorage } from './setToStorage'
import { enableMockStorage } from './_base'

describe('setToStorage function', () => {
  const mock = enableMockStorage()

  it('should set an item to localStorage', () => {
    setToStorage('testKey', { a: 1 })
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ a: 1 }))
    expect(mock.instance()).toEqual({ testKey: JSON.stringify({ a: 1 }) })
  })
})
