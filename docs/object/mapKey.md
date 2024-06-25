# Map Key Function

## Overview

The `mapKey` function creates a new object by mapping keys of an input object using a callback function.

### Example

```typescript
const obj = { a: 1, b: 2 }
const mappedObj = mapKey(obj, (key, value) => `new_${key}`)

console.log(mappedObj) // { new_a: 1, new_b: 2 }
```
