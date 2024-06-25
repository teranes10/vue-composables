export function setValueByObjectPath<T>(
  item: any,
  path: string,
  value: T,
): void {
  const keys = path.split('.')
  const lastIndex = keys.length - 1
  let current = item || {}

  for (let i = 0; i < lastIndex; i++) {
    const key = keys[i]
    if (current[key] == null) {
      current[key] = {}
    }

    current = current[key]
  }

  current[keys[lastIndex]] = value
}
