# Set Value By Object Path Function

## Overview

The `setValueByObjectPath` function sets a value in an object using a dot-separated path.

### Example

```typescript
const obj = { a: { b: {} } }
const path = 'a.b.c'
const newValue = 123
setValueByObjectPath(obj, path, value)

console.log(obj) // { a: { b: { c: 123 } } }
```
