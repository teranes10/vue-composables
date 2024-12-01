import { debounce } from '@teranes/utils'
import { type MaybeRef, type Ref, ref, unref } from '@vue/reactivity'
import { onBeforeUnmount, onMounted } from '@vue/runtime-core'

interface ResizeResult {
  width: number
  height: number
  entry?: ResizeObserverEntry
}

export function resizeObserver(
  element: MaybeRef<Element | undefined>,
  callback?: (result: ResizeResult) => void,
): Ref<ResizeResult> {
  const result = ref<ResizeResult>({ width: 0, height: 0 })

  const resizeObserver = new ResizeObserver(debounce((entries) => {
    result.value = toResult(entries?.[0])
    callback?.(result.value)
  }, 10))

  function toResult(entry: ResizeObserverEntry): ResizeResult {
    return {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
      entry,
    }
  }

  function observe(node: MaybeRef<Element | undefined>) {
    const el = unref(node)
    if (el) {
      resizeObserver.observe(el)
    }
  }

  function unobserve(node: MaybeRef<Element | undefined>) {
    const el = unref(node)
    if (el) {
      resizeObserver.unobserve(el)
    }
  }

  onMounted(() => {
    observe(element)
  })

  onBeforeUnmount(() => {
    unobserve(element)
    resizeObserver.disconnect()
  })

  return result
}
