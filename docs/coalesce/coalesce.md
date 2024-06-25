# Coalesce Function

## Overview

The `coalesce` function return the first non-nullish value from a list of values.

### `coalesce(...values)`

Returns the first non-nullish value from the provided list of values.

#### Parameters

- `values`: The list of values to evaluate.

#### Returns

The first non-nullish value, or `undefined` if all values are nullish.

### Example

```typescript
console.log(coalesce(null, undefined, 0, false, 'test')) // 0
console.log(coalesce(undefined, null, 'first', 'second')) // 'first'
console.log(coalesce(undefined, null)) // undefined
```
