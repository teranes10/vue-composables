# Is Array Function

Checks if the provided value is an array.

```typescript
const result = isArray(value)
```

## Parameters

| Parameters | Type | Required | Default | Description |
| ---------- | ---- | -------- | ------- | ----------- |
| value | `Any` | `true` | | The value to check |

## State

| State | Type | Description |
| ----- | ---- | ----------- |
| result | `Boolean` | `true` if the value is an array, otherwise `false` |

## Example

```typescript
console.log(isArray([])) // true
console.log(isArray('string')) // false
```
