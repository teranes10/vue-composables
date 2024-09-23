import { isTag } from '../tag/tag'

export function isRegex(value: unknown): value is RegExp {
  if (value == null) {
    return false
  }

  return isTag(value, 'Regex')
}
