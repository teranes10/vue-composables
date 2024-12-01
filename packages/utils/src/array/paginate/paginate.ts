export function paginate<T>(items: T[], page: number, itemsPerPage: number) {
  const start = (page - 1) * itemsPerPage
  const end = start + itemsPerPage
  return items?.slice(start, end) || []
}
