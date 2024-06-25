import { isObject } from './isObject'

export function objectAssign(target: any, src: any, forced = false) {
  if (src == null) {
    return target
  }

  if (target == null) {
    if (!forced) {
      return undefined
    }

    target ??= {}
  }

  for (const prop in src) {
    if (!Object.prototype.hasOwnProperty.call(target, prop)) {
      if (forced) {
        target[prop] = src[prop]
      }

      continue
    }

    target[prop] = getValue(target[prop], src[prop], forced)
  }

  return target
}

function getValue(target: any, src: any, forced = false) {
  if (!src == null) {
    return undefined
  }

  if (isObject(src)) {
    return objectAssign(target, src, forced)
  }

  return src
}
