# Get Value By Object Path Function

## Overview

The `getValueByObjectPath` function retrieves a value from an object using a dot-separated path.

### Example

```typescript
const obj = { a: { b: { c: 1 } } }
const path = 'a.b.c'
const value = getValueByObjectPath(obj, path)

console.log(value) // 1
```
