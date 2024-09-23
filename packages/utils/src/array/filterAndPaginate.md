# Filter and Paginate Function

This function filters and paginates a provided array of items.

```typescript
const { items: paginatedItems, totalItems } = filterAndPaginate(items, options)
```

## Parameters

| Parameters | Type | Required | Default | Description |
| ---------- | ---- | -------- | ------- | ----------- |
| items | `Array` | `true` | | The array of items to filter and paginate |
| options | [`FilterAndPaginateOptions`](#filterandpaginateoptions) | `true` | | Options to filter and paginate. |

## State

| State | Type | Description |
| ----- | ---- | ----------- |
| items | `Array` | The array of paginated items |
| totalItems | `Number` | The total number of items after filtering |

## Example

```typescript
const items = ['apple', 'banana', 'grape', 'orange', 'pear']
const options = { search: 'ap', page: 1, itemsPerPage: 2 }
const result = filterAndPaginate(items, options)
console.log(result) // { items: ['apple', 'grape'], totalItems: 2 }
```

### FilterAndPaginateOptions

| Parameters | Type | Required | Default | Description |
| ---------- | ---- | -------- | ------- | ----------- |
| search | `String` | `false` | | The search string to filter the items |
| page | `Number` | `true` | | The current page number |
| itemsPerPage | `Number` | `true` | | The number of items per page |
