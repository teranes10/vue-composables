import type { Merge } from './merge'
import { objectAssign } from './objectAssign'

export function assignDefaults<T, D>(obj: T, defaults: D): Merge<D, T> {
  return objectAssign(defaults, obj, { force: true, ignoreNull: true })
}
