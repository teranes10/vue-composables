import { compare } from './compare'

export function compareObject(target: any, src: any, forced = false): boolean {
  if (target === src) {
    return true
  }

  if (!src || !target || !Object.keys(target)?.length) {
    return false
  }

  for (const prop in src) {
    if (!Object.prototype.hasOwnProperty.call(target, prop)) {
      if (forced) {
        return false
      }

      continue
    }

    if (!compare(target[prop], src[prop], forced)) {
      return false
    }
  }

  return true
}
