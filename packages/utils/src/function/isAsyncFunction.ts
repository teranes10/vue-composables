import { isTag } from '../tag/tag'

export function isAsyncFunction<TArgs extends unknown[], TOut>(value: unknown): value is ((...args: TArgs) => Promise<TOut>) {
  if (value == null) {
    return false
  }

  return isTag(value, 'AsyncFunction')
}
