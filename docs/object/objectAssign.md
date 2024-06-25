# objectAssign Function

## Overview

Assigns properties from a source object (`src`) to a target object (`target`), optionally recursively, and optionally forces the assignment even if the property already exists in the target.

- `target`: The target object to which properties will be assigned.
- `src`: The source object from which properties will be assigned to `target`.
- `forced` (optional): If `true`, new properties in `src` that do not exist in `target` will also be added.

### Examples

```typescript
// Basic assignment without force
const target = null
const src = { a: 1, b: 2 }
const result = objectAssign(target, src)
// result is undefined
```

```typescript
// Basic assignment with force
const target = null
const src = { a: 1, b: 2 }
const result = objectAssign(target, src, true)
// result is { a: 1, b: 2 }
```

```typescript
// Update properties without force
const target = { a: 1, b: 2 }
const src = { b: 3, c: 4 }
const result = objectAssign(target, src)
// result is { a: 1, b: 3 }
```

```typescript
// Update properties with force
const target = { a: 1, b: 2 }
const src = { b: 3, c: 4 }
const result = objectAssign(target, src, true)
// result is { a: 1, b: 3, c: 4 }
```

```typescript
// Nested object assignment
const target = { a: { x: 1, y: 2 }, b: 2 }
const src = { a: { x: 10, z: 3 }, c: 4 }
const result = objectAssign(target, src, true)
// result is { a: { x: 10, y: 2, z: 3 }, b: 2, c: 4 }
```

```typescript
// Null src
const target = { a: 1 }
const src = null
const result = objectAssign(target, src)
// result is { a: 1 }
```
