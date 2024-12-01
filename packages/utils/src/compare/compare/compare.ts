import { isArray } from '../../array/is-array/isArray'
import { isObject } from '../../object/is-object/isObject'
import { compareType } from '../compare-type/compareType'
import { compareArray } from '../compare-array/compareArray'
import { compareObject } from '../compare-object/compareObject'

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
