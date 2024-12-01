export function getValueByObjectPath(
  item: any,
  path: string,
): any {
  const keys = path?.split('.')
  if (!keys?.length) {
    return null
  }

  let current = item

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (current[key] == null) {
      return undefined
    }

    current = current[key]
  }

  return current
}
