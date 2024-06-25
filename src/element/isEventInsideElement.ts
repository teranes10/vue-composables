export function isEventInsideElement(el: HTMLElement, e: MouseEvent) {
  const rect = el.getBoundingClientRect()
  const xValid = rect.left <= e.clientX && e.clientX <= rect.right
  const yValid = rect.top <= e.clientY && e.clientY <= rect.bottom

  return xValid && yValid
}
