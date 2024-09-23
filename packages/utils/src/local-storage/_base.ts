import { afterEach, beforeEach, vi } from 'vitest'

export function enableMockStorage() {
  let mockStorage: Record<string, string> = {}

  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key: string) => {
      return mockStorage[key] || null
    })

    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key: string, value: string) => {
      mockStorage[key] = value
    })

    vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => {
      Object.keys(mockStorage).forEach((key) => {
        delete mockStorage[key]
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    mockStorage = {}
  })

  return {
    instance() {
      return mockStorage
    },
  }
}
