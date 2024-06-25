# Filter Function

Filters the provided array of items based on the search string.

```typescript
const filteredItems = filter(items, search)
```

## Parameters

| Parameters | Type | Required | Default | Description |
| ---------- | ---- | -------- | ------- | ----------- |
| items | `Array` | `true` | | The array of items to filter |
| search | `String` | `true` | | The search string to filter the items |

## State

| State | Type | Description |
| ----- | ---- | ----------- |
| filteredItems | `Array` | The array of filtered items |

## Example

```typescript
const items = ['apple', 'banana', 'grape']
const search = 'ap'
const result = filter(items, search)
console.log(result) // ['apple', 'grape']
```
