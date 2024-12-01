import { isArray } from '../array/is-array/isArray'

export function isNullOrEmptyArray(value: unknown) {
  return value == null || (isArray(value) && value.length === 0)
}
