import { getTag } from '../../tag/tag'

export function compareType<Target, Source>(target: Target, src: Source) {
  return getTag(target) === getTag(src)
}
