import { isTag } from '../tag/tag'

export function isObject(value: unknown): value is object {
  if (value == null) {
    return false
  }

  return isTag(value, 'Object')
}
