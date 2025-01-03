// ** Event listeners calling order **
// Capturing phase: the event starts from the topmost element in the DOM tree and propagates down to the target element
// Bubbling phase: the event starts from the target element and propagates up through its ancestors to the topmost element in the DOM tree

import { type MaybeRef, isRef } from '@vue/reactivity'
import { onMounted, onUnmounted } from '@vue/runtime-core'
import type { Arrayable } from '@teranes/utils'

export function eventListener<K extends keyof HTMLElementEventMap>(
  nodes: Arrayable<MaybeRef<HTMLElement | undefined>>,
  event: K,
  callback: (options: HTMLElementEventMap[K], node: HTMLElement) => void,
  options: Partial<AddEventListenerOptions> = {},
) {
  const clearEvents: (() => void)[] = []

  const addEventListener = (node: MaybeRef<HTMLElement | undefined>) => {
    const currentNode = isRef(node) ? node.value : node
    if (currentNode) {
      const listener = (options: HTMLElementEventMap[K]) => {
        callback(options, currentNode)
      }

      currentNode.addEventListener(event, listener, options)

      clearEvents.push(() => {
        currentNode.removeEventListener(event, listener, options)
      })
    }
  }

  onMounted(() => {
    if (Array.isArray(nodes)) {
      for (const node of nodes) {
        addEventListener(node)
      }
    }
    else {
      addEventListener(nodes)
    }
  })

  onUnmounted(() => {
    for (const clear of clearEvents) {
      clear()
    }
  })
}
