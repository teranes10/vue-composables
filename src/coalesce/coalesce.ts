export function coalesce<T extends any[]>(...values: T): Last<T> {
  for (const value of values) {
    if (value != null) {
      return value
    }
  }

  return undefined as Last<T>
}

type Last<T extends any[]> = T extends [...any[], infer Z] ? Z : never
