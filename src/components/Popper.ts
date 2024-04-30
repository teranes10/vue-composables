import {
  createPopper,
  Instance as PopperInstance,
  Placement
} from "@popperjs/core";
import { ref, Ref, onUnmounted } from "vue";

export type PopperAction = 'hover' | 'click'
export type PopperModifiers = 'same-width' | 'prevent-overflow'
export type PopperOffset = [number, number];

export type PopperInput = {
  popperEl: HTMLElement;
  referenceEl: Element;
  persistent?: boolean;
  placement?: Placement;
  isShowing?: Ref<boolean>;
  activeClass?: string,
  modifiers?: PopperModifiers[],
  action?: PopperAction,
  offset?: PopperOffset
}

export type Popper = {
  show: (reference?: Element | MouseEvent) => void;
  hide: () => void;
  toggle: (reference?: Element | MouseEvent) => void;
  destroy: () => void;
}

export function usePopper({
  popperEl,
  referenceEl,
  persistent = false,
  placement = "bottom-start",
  isShowing = ref(false),
  modifiers = [],
  activeClass,
  action,
  offset
}: PopperInput): Popper {
  var popperInstance: PopperInstance | null;
  var isScrollDisabled = false;
  var removeHideOnOutClick: () => void;

  function createPopperInstance(reference?: Element | MouseEvent) {
    if (!popperEl) {
      console.error('Popper element is not found.');
      return;
    }

    let popperReference;
    if (referenceEl) {
      popperReference = referenceEl;
    } else if (reference instanceof Element) {
      popperReference = reference;
    } else if (reference instanceof MouseEvent) {
      popperReference = {
        getBoundingClientRect: generateGetBoundingClientRect(
          reference.clientX,
          reference.clientY
        ),
      };
    }

    if (!popperReference) {
      console.error('Popper reference is not found.');
      return;
    }

    const _modifiers: any[] = [];
    if (modifiers.length > 0 || offset) {
      if (modifiers.includes('same-width')) {
        _modifiers.push({
          name: "sameWidth",
          enabled: true,
          phase: "beforeWrite",
          fn: ({ state }: any) => {
            state.elements.popper.style.width = `${(state.elements.reference as HTMLElement).offsetWidth
              }px`;
          },
        })
      }

      if (modifiers.includes('prevent-overflow')) {
        _modifiers.push({
          name: "preventOverflow",
          enabled: true,
          phase: "beforeWrite",
          options: {
            boundariesElement: popperEl.parentElement,
          },
        })
      }

      if (offset) {
        _modifiers.push({
          name: 'offset',
          options: {
            offset: offset,
          },
        })
      }
    }

    popperInstance = createPopper(popperReference, popperEl, {
      placement: placement,
      modifiers: _modifiers,
    });
  };

  function destroy() {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };

  function show(reference?: Element | MouseEvent) {
    if (isShowing.value) {
      return;
    }

    if (popperInstance) {
      destroy();
    }

    createPopperInstance(reference);
    if (popperInstance && popperEl) {
      if (activeClass) {
        popperEl.classList.add(activeClass);
      } else {
        popperEl.style.display = 'block'
      }

      isShowing.value = true;

      if (!persistent) {
        if (referenceEl) {
          removeHideOnOutClick = hideOnOutClick(referenceEl);
        } else if (reference instanceof Element) {
          removeHideOnOutClick = hideOnOutClick(reference);
        } else if (reference instanceof MouseEvent) {
          removeHideOnOutClick = hideOnOutClick(reference.target as Element);
          disableScroll();
        }
      }
    }
  };

  function hide() {
    if (!isShowing.value) {
      return;
    }

    if (popperEl) {
      if (activeClass) {
        popperEl.classList.remove(activeClass);
      } else {
        popperEl.style.display = 'none'
      }

      isShowing.value = false;
    }

    if (isScrollDisabled) {
      enableScroll();
    }

    if (!persistent && removeHideOnOutClick) {
      removeHideOnOutClick();
    }
  };

  function toggle(reference?: Element | MouseEvent) {
    if (isShowing.value) {
      hide();
    } else {
      show(reference);
    }
  };

  function hideOnOutClick(referenceEl?: Element) {
    const close = (e: MouseEvent) => {
      const outSidePopper = popperEl && !popperEl.contains(e.target as Node);
      const outSideReference =
        referenceEl && !referenceEl.contains(e.target as Node);

      if (outSidePopper && outSideReference) {
        hide();
      }
    };

    setTimeout(() => {
      document.addEventListener("click", close);
      document.addEventListener("contextmenu", close);
    }, 50);

    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("contextmenu", close);
    };
  };

  function disableScroll() {
    document.body.style.overflow = "hidden";
    isScrollDisabled = true;
  };

  function enableScroll() {
    document.body.style.overflow = "auto";
    isScrollDisabled = false;
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
      toJSON: () => "",
    });
  };

  if (!activeClass) {
    popperEl.style.display = 'none'
  }

  const clearFunctions: (() => void)[] = [];

  if (action) {
    if (action === 'click') {
      const clickListener = () => { toggle(); }

      referenceEl.addEventListener('click', clickListener);
      clearFunctions.push(() => {
        referenceEl.removeEventListener('click', clickListener);
      })
    }

    if (action === 'hover') {
      const mouseenterListener = () => { show(); }
      const mouseleaveListener = () => { hide(); }

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

  onUnmounted(() => {
    destroy();
    clearFunctions.forEach(clear => clear());
  })

  return { show, hide, toggle, destroy };
}
