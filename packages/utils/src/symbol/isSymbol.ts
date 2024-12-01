import { TAG, getTag } from '../tag/tag'

export function isSymbol<T>(value: T) {
  const type = typeof value
  return (
    type === 'symbol'
    || (type === 'object' && value != null && getTag(value) === TAG.Symbol)
  )
}
