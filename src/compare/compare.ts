import { isArray } from '../array/isArray'
import { isObject } from '../object/isObject'
import { compareType } from './compareType'
import { compareArray } from './compareArray'
import { compareObject } from './compareObject'

export function compare(target: unknown, src: unknown, forced = false): boolean {
  if (!compareType(target, src)) {
    return false
  }

  if (isObject(src) && isObject(target)) {
    return compareObject(target, src, forced)
  }

  if (isArray(src) && isArray(target)) {
    return compareArray(target, src, forced)
  }

  return target === src
}
