import { compare } from '../compare/compare'

export function compareArray(target: unknown[], src: unknown[], forced = false): boolean {
  if (target === src) {
    return true
  }

  if (!src || !target || target.length !== src.length) {
    return false
  }

  for (let i = 0; i < src.length; i++) {
    if (!compare(target[i], src[i], forced)) {
      return false
    }
  }

  return true
}
