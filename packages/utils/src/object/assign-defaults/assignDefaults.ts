import type { Merge } from '../merge/merge'
import { objectAssign } from '../object-assign/objectAssign'

export function assignDefaults<T, D>(obj: T, defaults: D): Merge<D, T> {
  return objectAssign(defaults, obj, { force: true, ignoreNull: true })
}
