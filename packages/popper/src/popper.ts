import type { Placement, Instance as PopperInstance } from '@popperjs/core'
import { createPopper } from '@popperjs/core'

export function popper({
  popperEl,
  referenceEl,
  persistent = false,
  placement = 'bottom-start',
  modifiers = [],
  activeClass,
  action,
  offset,
  duplicates = false,
  onStateChanged
}: PopperInput): Popper {
  let popperInstance: PopperInstance | null
  let popperElement: HTMLElement
  let showing = false
  let isScrollDisabled = false
  let removeHideOnOutClick: () => void

  function createPopperInstance(reference?: Element | MouseEvent) {
    if (!popperEl) {
      console.error('Popper element is not found.')
      return
    }

    if (duplicates) {
      const container = popperContainer()
      if (container) {
        popperElement = popperEl.cloneNode(true) as HTMLElement
        container.append(popperElement)
      }
    }
    else {
      popperElement = popperEl
    }

    let popperReference
    if (referenceEl) {
      popperReference = referenceEl
    }
    else if (reference instanceof Element) {
      popperReference = reference
    }
    else if (reference instanceof MouseEvent) {
      popperReference = {
        getBoundingClientRect: generateGetBoundingClientRect(
          reference.clientX,
          reference.clientY,
        ),
      }
    }

    if (!popperReference) {
      console.error('Popper reference is not found.')
      return
    }

    const _modifiers: any[] = []
    if (modifiers.length > 0 || offset) {
      if (modifiers.includes('same-width')) {
        _modifiers.push({
          name: 'sameWidth',
          enabled: true,
          phase: 'beforeWrite',
          fn: ({ state }: any) => {
            state.elements.popper.style.width = `${(state.elements.reference as HTMLElement).offsetWidth
              }px`
          },
        })
      }

      if (modifiers.includes('prevent-overflow')) {
        _modifiers.push({
          name: 'preventOverflow',
          enabled: true,
          phase: 'beforeWrite',
          options: {
            boundariesElement: popperElement.parentElement,
          },
        })
      }

      if (offset) {
        _modifiers.push({
          name: 'offset',
          options: {
            offset,
          },
        })
      }
    }

    popperInstance = createPopper(popperReference, popperElement, {
      placement,
      modifiers: _modifiers,
    })
  };

  function destroy() {
    if (duplicates && popperElement) {
      popperElement.remove()
    }

    if (popperInstance) {
      popperInstance.destroy()
      popperInstance = null
    }
  };

  function show(reference?: Element | MouseEvent) {
    if (showing) {
      return
    }

    if (popperInstance) {
      destroy()
    }

    if (!popperInstance) {
      createPopperInstance(reference)
    }

    if (popperInstance && popperElement) {
      if (activeClass) {
        popperElement.classList.add(activeClass)
      }
      else {
        popperElement.style.display = 'block'
      }

      showing = true
      onStateChanged?.('show', true)

      if (!persistent) {
        if (referenceEl) {
          removeHideOnOutClick = hideOnOutClick(referenceEl)
        }
        else if (reference instanceof Element) {
          removeHideOnOutClick = hideOnOutClick(reference)
        }
        else if (reference instanceof MouseEvent) {
          removeHideOnOutClick = hideOnOutClick(reference.target as Element)
          disableScroll()
        }
      }
    }
  };

  function hide() {
    if (!showing) {
      return
    }

    if (popperElement) {
      if (activeClass) {
        popperElement.classList.remove(activeClass)
      }
      else {
        popperElement.style.display = 'none'
      }

      showing = false
      onStateChanged?.('show', false)
    }

    if (isScrollDisabled) {
      enableScroll()
    }

    if (!persistent && removeHideOnOutClick) {
      removeHideOnOutClick()
    }
  };

  function toggle(reference?: Element | MouseEvent) {
    if (showing) {
      hide()
    }
    else {
      show(reference)
    }
  };

  function hideOnOutClick(referenceEl?: Element) {
    const close = (e: MouseEvent) => {
      const outSidePopper = popperElement && !popperElement.contains(e.target as Node)
      const outSideReference
        = referenceEl && !referenceEl.contains(e.target as Node)

      if (outSidePopper && outSideReference) {
        hide()
      }
    }

    setTimeout(() => {
      if (document) {
        document.addEventListener('click', close)
        document.addEventListener('contextmenu', close)
      }
    }, 50)

    return () => {
      if (document) {
        document.removeEventListener('click', close)
        document.removeEventListener('contextmenu', close)
      }
    }
  };

  function disableScroll() {
    if (document) {
      document.body.style.overflow = 'hidden'
      isScrollDisabled = true
    }
  };

  function enableScroll() {
    if (document) {
      document.body.style.overflow = 'auto'
      isScrollDisabled = false
    }
  };

  function generateGetBoundingClientRect(x = 0, y = 0) {
    return (): DOMRect => ({
      width: 0,
      height: 0,
      x,
      y,
      top: y,
      right: x,
      bottom: y,
      left: x,
      toJSON: () => '',
    })
  };

  function popperContainer(): HTMLElement | undefined {
    if (document) {
      let container = document.getElementById('popper-container')
      if (!container) {
        container = document.createElement('div')
        container.id = 'popper-container'
        document.body.append(container)
      }

      return container
    }

    return undefined
  };

  if (!activeClass) {
    popperEl.style.display = 'none'
  }

  const clearFunctions: (() => void)[] = []

  if (action) {
    if (action === 'click') {
      const clickListener = () => {
        toggle()
      }

      referenceEl.addEventListener('click', clickListener)
      clearFunctions.push(() => {
        referenceEl.removeEventListener('click', clickListener)
      })
    }

    if (action === 'hover') {
      const mouseenterListener = () => {
        show()
      }
      const mouseleaveListener = () => {
        hide()
      }

      referenceEl.addEventListener('mouseenter', mouseenterListener)
      clearFunctions.push(() => {
        referenceEl.removeEventListener('mouseenter', mouseenterListener)
      })

      referenceEl.addEventListener('mouseleave', mouseleaveListener)
      clearFunctions.push(() => {
        referenceEl.removeEventListener('mouseleave', mouseleaveListener)
      })
    }
  }

  function release() {
    destroy()
    clearFunctions.forEach(clear => clear())
  }
 
  function isShowing() {
    return showing;
  }

  return { show, hide, toggle, destroy, release, isShowing }
}

export interface Popper {
  show: (reference?: Element | MouseEvent) => void
  hide: () => void
  toggle: (reference?: Element | MouseEvent) => void
  destroy: () => void
  release: () => void
  isShowing: () => boolean
}

export type StateType = 'show'
export interface PopperInput {
  popperEl: HTMLElement
  referenceEl: Element
  persistent?: boolean
  placement?: Placement
  activeClass?: string
  modifiers?: PopperModifiers[]
  action?: PopperAction
  offset?: PopperOffset
  duplicates?: boolean
  onStateChanged?: (type: StateType, value: any) => void
}

type PopperAction = 'hover' | 'click'
type PopperModifiers = 'same-width' | 'prevent-overflow'
type PopperOffset = [number, number]
