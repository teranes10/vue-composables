export function setToStorage<T>(key: string, item: T) {
  localStorage.setItem(key, JSON.stringify(item))
}
