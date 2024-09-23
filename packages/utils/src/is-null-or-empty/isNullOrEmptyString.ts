import { isString } from '../string/isString'

export function isNullOrEmptyString(value: unknown) {
  return value == null || (isString(value) && value.trim().length === 0)
}
