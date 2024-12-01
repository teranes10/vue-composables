# Paginate Function

Paginates the provided array of items.

```typescript
const { items: paginatedItems, totalItems } = paginate(items, page, itemsPerPage)
```

## Parameters

| Parameters | Type | Required | Default | Description |
| ---------- | ---- | -------- | ------- | ----------- |
| items | `Array` | `true` | | The array of items to paginate |
| page | `Number` | `true` | | The current page number |
| itemsPerPage | `Number` | `true` | | The number of items per page |

## State

| State | Type | Description |
| ----- | ---- | ----------- |
| items | `Array` | The array of paginated items |
| totalItems | `Number` | The total number of items |

## Example

```typescript
const items = ['apple', 'banana', 'grape', 'orange', 'pear']
const page = 2
const itemsPerPage = 2
const result = paginate(items, page, itemsPerPage)
console.log(result) // ['grape', 'orange']
```
