export function getBackgroundColor(element: Element) {
  let bgColor = window.getComputedStyle(element)?.getPropertyValue('background-color')
  if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
    return bgColor
  }

  if (element.parentElement) {
    bgColor = getBackgroundColor(element.parentElement)
    return bgColor
  }

  return '#ffffff'
}
