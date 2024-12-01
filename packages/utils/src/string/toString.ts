import { isSymbol } from '../symbol/isSymbol'

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0

export function toString<T>(value: T): string {
  if (value == null) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map(v => (v == null ? '' : toString(v))).join(',')
  }
  if (isSymbol(value)) {
    return value.toString()
  }

  const result = `${value}`
  return result === '0' && 1 / (value as any) === -INFINITY ? '-0' : result
}
