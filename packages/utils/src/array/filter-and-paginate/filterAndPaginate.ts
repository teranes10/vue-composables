import { filter } from '../filter/filter'
import { paginate } from '../paginate/paginate'

export interface FilterAndPaginateOptions {
  search?: string
  page: number
  itemsPerPage: number
}

export function filterAndPaginate<T>(
  items: T[],
  options: FilterAndPaginateOptions,
) {
  const filteredItems = filter(items, options.search || '')
  const paginatedItems = paginate(
    filteredItems,
    options.page,
    options.itemsPerPage,
  )

  return { items: paginatedItems, totalItems: filteredItems.length }
}
