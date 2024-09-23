import { isTag } from '../tag/tag'

export function isString(value: unknown): value is string {
  if (value == null) {
    return false
  }

  return isTag(value, 'String')
}
