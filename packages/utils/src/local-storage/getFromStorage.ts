export function getFromStorage<T>(key: string, defaultValue: T) {
  const item = localStorage.getItem(key) || ''
  return item ? (JSON.parse(item) as T) : defaultValue
}
