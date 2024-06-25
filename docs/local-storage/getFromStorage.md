# Get From Local Storage Function

## Overview

The `getFromStorage` function facilitate interacting with the `localStorage` API in a type-safe manner.

### `getFromStorage(key, defaultValue)`

Retrieves an item from `localStorage`. If the item does not exist, returns the provided default value.

#### Parameters

- `key`: The key under which the item is stored in `localStorage`.
- `defaultValue`: The default value to return if the item does not exist in `localStorage`.

#### Returns

The retrieved item, or the default value if the item does not exist.

### Example

```typescript
const user = getFromStorage('user', { name: '', age: 0 })
console.log(user) // { name: '', age: 0 } if 'user' does not exist in localStorage
```
