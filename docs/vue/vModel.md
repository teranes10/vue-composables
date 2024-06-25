# vModel Function

## Overview

Creates a proxy reference for a given prop, allowing for a two-way data binding in Vue 3 using the Composition API.

- `props`: The component's props object.
- `key`: The key of the prop to bind to.
- `emit` (optional): The emit function to trigger updates.
- `defaultValue` (optional): A default value to use if the prop is undefined.

#### Examples

```vue
<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const data = vModel(props, 'modelValue', emit)
</script>
```
