import { nanoid } from 'nanoid'

export function getUniqueId(size: number = 6) {
  return nanoid(size)
}
