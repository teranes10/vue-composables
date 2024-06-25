# Clone Deep Function

## Overview

The `cloneDeep` function creates a deep clone of an object or array.

### Example

```typescript
const obj = { a: { b: 1 } }
const clonedObj = cloneDeep(obj)

console.log(clonedObj) // { a: { b: 1 } }
console.log(obj === clonedObj) // false (different reference)
```
