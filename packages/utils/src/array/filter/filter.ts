import { isObject } from '../../object/is-object/isObject'

export function filter<T>(items: T[], search: string) {
  const filter = search?.trim()?.toLowerCase() || ''

  const includes = (item: T) => {
    if (isObject(item)) {
      return Object.keys(item || {}).some(key =>
        (item)[key as keyof T]?.toString()?.toLowerCase()?.includes(filter),
      )
    }

    return item?.toString()?.toLowerCase()?.includes(filter)
  }

  return items?.filter(item => includes(item)) || []
}
