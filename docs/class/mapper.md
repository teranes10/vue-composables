# Mapper Function

## Overview

The `mapper` function creates an instance of a given class and maps properties from a source object to the instance.

### `mapper(class, src)`

Creates an instance of the specified class and maps properties from the source object to the instance.

#### Parameters

- `class`: The class type to instantiate.
- `src`: The source object from which to map properties.

#### Returns

An instance of the specified class with properties mapped from the source object.

## Example

### TypeScript

```typescript
class ExampleClass {
  prop1: string = ''
  prop2: number = 0
}

const src = { prop1: 'test', prop2: 123 }
const result = mapper(ExampleClass, src)

console.log(result) // ExampleClass { prop1: 'test', prop2: 123 }
```
