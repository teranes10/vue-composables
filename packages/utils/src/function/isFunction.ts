import { isTag } from '../tag/tag'

export function isFunction(value: unknown): value is (...args: any[]) => any {
  if (value == null) {
    return false
  }

  return isTag(value, 'Function') || isTag(value, 'AsyncFunction')
}
