# Popper Function

Creates and manages a Popper.js instance for positioning elements relative to a reference element, with optional event-based show/hide actions and modifiers.

- `popperEl` (`HTMLElement`): The popper element to be positioned.
- `referenceEl` (`Element`): The reference element for the popper positioning.
- `persistent` (`boolean`, optional): Whether the popper stays open unless explicitly closed.
- `placement` (`string`, optional): The placement of the popper relative to the reference element. Defaults to `'bottom-start'`.
- `isShowing` (`Ref<boolean>`, optional): A reactive reference to track the popper's visibility state. Defaults to `ref(false)`.
- `modifiers` (`PopperModifiers[]`, optional): An array of modifiers for the popper. Defaults to an empty array.
- `activeClass` (`string`, optional): A class to add to the popper element when it is shown.
- `action` (`PopperAction`, optional): The action that triggers the popper (e.g., `'click'` or `'hover'`).
- `offset` (`PopperOffset`, optional): Offset values for the popper positioning.
- `duplicates` (`boolean`, optional): Whether to allow duplicate popper elements. Defaults to `false`.

#### Examples

```javascript
import { onMounted, ref } from 'vue'

export default {
  setup() {
    const isShowing = ref(false)
    let popperInstance

    onMounted(() => {
      const popperEl = document.getElementById('my-popper')
      const referenceEl = document.getElementById('my-reference')
      popperInstance = popper({
        popperEl,
        referenceEl,
        isShowing,
        action: 'click',
        activeClass: 'active',
      })
    })

    return { isShowing, popperInstance }
  },
}
```
