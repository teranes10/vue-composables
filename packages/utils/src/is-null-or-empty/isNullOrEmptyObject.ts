import { isObject } from '../object/is-object/isObject'

export function isNullOrEmptyObject(value: unknown) {
  return value == null || (isObject(value) && Object.keys(value).length === 0)
}
