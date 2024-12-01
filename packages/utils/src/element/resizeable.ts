export interface ResizableOptions {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  direction?: 'width' | 'height' | 'both'
}

export function resizable(resizableElement: HTMLElement, handleElement: HTMLElement, {
  minWidth = 25,
  minHeight = 25,
  maxWidth = document.documentElement.clientWidth,
  maxHeight = document.documentElement.clientHeight,
  direction = 'both',
}: ResizableOptions) {
  switch (direction) {
    case 'width':
      handleElement.style.cursor = 'ew-resize'
      break
    case 'height':
      handleElement.style.cursor = 'ns-resize'
      break
    case 'both':
    default:
      handleElement.style.cursor = 'nwse-resize'
  }

  handleElement.addEventListener('mousedown', resizeStart)
  handleElement.addEventListener('touchstart', resizeStart, { passive: false })

  let _x: number, _y: number, _w: number, _h: number

  function resizeStart(e: MouseEvent | TouchEvent) {
    e.preventDefault()
    _x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    _y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY
    _w = Number.parseInt(document.defaultView!.getComputedStyle(resizableElement).width, 10)
    _h = Number.parseInt(document.defaultView!.getComputedStyle(resizableElement).height, 10)

    document.documentElement.addEventListener('mousemove', onResize)
    document.documentElement.addEventListener('touchmove', onResize, { passive: false })
    document.documentElement.addEventListener('mouseup', resizeEnd)
    document.documentElement.addEventListener('touchend', resizeEnd)
  }

  function resizeEnd() {
    document.documentElement.removeEventListener('mousemove', onResize)
    document.documentElement.removeEventListener('touchmove', onResize)
    document.documentElement.removeEventListener('mouseup', resizeEnd)
    document.documentElement.removeEventListener('touchend', resizeEnd)
  }

  function onResize(e: MouseEvent | TouchEvent) {
    e.preventDefault()

    const x = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX
    const y = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY

    let newWidth = _w + (x - _x)
    let newHeight = _h + (y - _y)

    newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth))
    newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight))

    if (direction === 'both' || direction === 'width') {
      resizableElement.style.width = `${newWidth}px`
    }
    if (direction === 'both' || direction === 'height') {
      resizableElement.style.height = `${newHeight}px`
    }
  }
}
