import { onUnmounted } from 'vue'
import { isEventInsideElement } from './isEventInsideElement'

export function eventListener(
  element: HTMLElement,
  event: 'click',
  callback: (e: MouseEvent, el: HTMLElement) => void,
  childNodes: HTMLElement[] = [], // parent -> child order
  removeOtherEvents: boolean = false,
) {
  const listener = (e: MouseEvent) => {
    if (removeOtherEvents) {
      e.stopImmediatePropagation()
    }

    let clickedElement = element
    for (const node of childNodes.reverse()) {
      if (isEventInsideElement(node, e)) {
        clickedElement = node
        break
      }
    }

    callback(e, clickedElement)
  }

  element.addEventListener(event, listener, true)

  onUnmounted(() => {
    element.removeEventListener(event, listener, true)
  })
}
