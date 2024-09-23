import { isTag } from '../tag/tag'

export function isNumber(value: unknown): value is number {
  if (value == null) {
    return false
  }

  return isTag(value, 'Number')
}
