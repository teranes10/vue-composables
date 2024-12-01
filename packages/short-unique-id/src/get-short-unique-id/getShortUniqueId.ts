import { nanoid } from 'nanoid'

export function getShortUniqueId(size: number = 6) {
  return nanoid(size)
}
