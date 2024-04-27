import {
  createPopper,
  Instance as PopperInstance,
  Placement,
} from "@popperjs/core";
import { ref, Ref } from "vue";

export type PopperInput = {
  popperEl: HTMLElement;
  referenceEl?: Element;
  persistent?: boolean;
  placement?: Placement;
  isShowing?: Ref<boolean>;
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
}: PopperInput): Popper {
  var popperInstance: PopperInstance | null;
  var isScrollDisabled = false;
  var removeHideOnOutClick: () => void;

  const createPopperInstance = (reference?: Element | MouseEvent) => {
    if (!popperEl) {
      return null;
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
      return null;
    }

    popperInstance = createPopper(popperReference, popperEl, {
      placement: placement,
      modifiers: [
        {
          name: "sameWidth",
          enabled: true,
          phase: "beforeWrite",
          fn: ({ state }) => {
            state.elements.popper.style.width = `${(state.elements.reference as HTMLElement).offsetWidth
              }px`;
          },
        },
        {
          name: "preventOverflow",
          enabled: true,
          phase: "beforeWrite",
          options: {
            boundariesElement: popperEl.parentElement,
          },
        },
      ],
    });
  };

  const destroy = () => {
    if (popperInstance) {
      popperInstance.destroy();
      popperInstance = null;
    }
  };

  const show = (reference?: Element | MouseEvent) => {
    if (isShowing.value) {
      return;
    }

    if (popperInstance) {
      destroy();
    }

    createPopperInstance(reference);
    if (popperInstance && popperEl) {
      popperEl.classList.add("show");
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

  const hide = () => {
    if (!isShowing.value) {
      return;
    }

    if (popperEl) {
      popperEl.classList.remove("show");
      isShowing.value = false;
    }

    if (isScrollDisabled) {
      enableScroll();
    }

    if (!persistent && removeHideOnOutClick) {
      removeHideOnOutClick();
    }
  };

  const toggle = (reference?: Element | MouseEvent) => {
    if (isShowing.value) {
      hide();
    } else {
      show(reference);
    }
  };

  const hideOnOutClick = (referenceEl?: Element) => {
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

  const disableScroll = () => {
    document.body.style.overflow = "hidden";
    isScrollDisabled = true;
  };

  const enableScroll = () => {
    document.body.style.overflow = "auto";
    isScrollDisabled = false;
  };

  const generateGetBoundingClientRect = (x = 0, y = 0) => {
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

  return { show, hide, toggle, destroy };
}
