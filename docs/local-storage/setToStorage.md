# Set To Local Storage Function

## Overview

The `setToStorage` function facilitate interacting with the `localStorage` API in a type-safe manner.

### `setToStorage(key, value)`

Set an item to `localStorage`.

#### Parameters

- `key`: The key under which the item is stored in `localStorage`.
- `value`: The value to set in `localStorage`.

### Example

```typescript
const user = setToStorage('user', { name: '', age: 0 })
```
