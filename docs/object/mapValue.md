# Map Value Function

## Overview

The `mapValue` function creates a new object by mapping values of an input object using a callback function.

### Example

```typescript
const obj = { a: 1, b: 2 }
const mappedObj = mapValue(obj, value => value * 2)

console.log(mappedObj) // { a: 2, b: 4 }
```
