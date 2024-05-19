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
  offset?: PopperOffset,
  duplicates?: boolean
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
  offset,
  duplicates = false
}: PopperInput): Popper {
  var popperInstance: PopperInstance | null;
  var popperElement: HTMLElement
  var isScrollDisabled = false;
  var removeHideOnOutClick: () => void;

  function createPopperInstance(reference?: Element | MouseEvent) {
    if (!popperEl) {
      console.error('Popper element is not found.');
      return;
    }

    if (duplicates) {
      const container = popperContainer();
      if (container) {
        popperElement = popperEl.cloneNode(true) as HTMLElement;
        container.append(popperElement);
      }
    } else {
      popperElement = popperEl;
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
            boundariesElement: popperElement.parentElement,
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

    popperInstance = createPopper(popperReference, popperElement, {
      placement: placement,
      modifiers: _modifiers,
    });
  };

  function destroy() {
    if (duplicates && popperElement) {
      popperElement.remove()
    }

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

    if (!popperInstance) {
      createPopperInstance(reference);
    }

    if (popperInstance && popperElement) {
      if (activeClass) {
        popperElement.classList.add(activeClass);
      } else {
        popperElement.style.display = 'block'
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

    if (popperElement) {
      if (activeClass) {
        popperElement.classList.remove(activeClass);
      } else {
        popperElement.style.display = 'none'
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
      const outSidePopper = popperElement && !popperElement.contains(e.target as Node);
      const outSideReference =
        referenceEl && !referenceEl.contains(e.target as Node);

      if (outSidePopper && outSideReference) {
        hide();
      }
    };

    setTimeout(() => {
      if (document) {
        document.addEventListener("click", close);
        document.addEventListener("contextmenu", close);
      }
    }, 50);

    return () => {
      if (document) {
        document.removeEventListener("click", close);
        document.removeEventListener("contextmenu", close);
      }
    };
  };

  function disableScroll() {
    if (document) {
      document.body.style.overflow = "hidden";
      isScrollDisabled = true;
    }
  };

  function enableScroll() {
    if (document) {
      document.body.style.overflow = "auto";
      isScrollDisabled = false;
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
      toJSON: () => "",
    });
  };

  function popperContainer(): HTMLElement | undefined {
    if (document) {
      let container = document.getElementById("popper-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "popper-container";
        document.body.append(container);
      }

      return container;
    }

    return undefined;
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
