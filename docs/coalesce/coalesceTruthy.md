# Coalesce Truthy Function

## Overview

The `coalesceTruthy` function return the first truthy value from a list of values.

### `coalesceTruthy(...values)`

Returns the first non-nullish value from the provided list of values.

#### Parameters

- `values`: The list of values to evaluate.

#### Returns

The first truthy value, or fallback to coalesce if no truthy value is found.

### Example

```typescript
console.log(coalesceTruthy(null, undefined, 0, false, 'test')) // 'test'
console.log(coalesceTruthy(undefined, null, 'first', 'second')) // 'first'
console.log(coalesceTruthy(undefined, null)) // undefined
```
