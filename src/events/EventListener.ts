import { onUnmounted } from "vue";

type Event = "click";

export function useEventListener(
  element: HTMLElement,
  event: Event,
  callback: (e: MouseEvent, el: HTMLElement) => void,
  childNodes: HTMLElement[] = [], // parent -> child order
  removeOtherEvents: boolean = false
) {
  const listener = (e: MouseEvent) => {
    if (removeOtherEvents) {
      e.stopImmediatePropagation();
    }

    let clickedElement = element;
    for (let node of childNodes.reverse()) {
      if (useIsEventInsideElement(node, e)) {
        clickedElement = node;
        break;
      }
    }

    callback(e, clickedElement);
  };

  element.addEventListener(event, listener, true);
  onUnmounted(() => {
    element.removeEventListener(event, listener, true);
  });
}

export function useIsEventInsideElement(el: HTMLElement, e: MouseEvent) {
  const rect = el.getBoundingClientRect();
  const xValid = rect.left <= e.clientX && e.clientX <= rect.right;
  const yValid = rect.top <= e.clientY && e.clientY <= rect.bottom;

  return xValid && yValid;
}
