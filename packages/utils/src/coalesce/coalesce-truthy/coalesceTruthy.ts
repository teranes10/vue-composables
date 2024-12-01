import { coalesce } from '../coalesce/coalesce'

export function coalesceTruthy<T extends any[]>(...values: T): Last<T> {
  for (const value of values) {
    if (value) {
      return value
    }
  }

  return coalesce(...values)
}

type Last<T extends any[]> = T extends [...any[], infer Z] ? Z : never
