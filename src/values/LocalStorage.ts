export function useGetFromStorage<T>(key: string, defaultValue: T) {
  const item = localStorage.getItem(key) || "";
  return item ? (JSON.parse(item) as T) : defaultValue;
}

export function useSetToStorage<T>(key: string, item: T) {
  localStorage.setItem(key, JSON.stringify(item));
}
