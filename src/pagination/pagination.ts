import { type Ref, computed, ref, watch } from 'vue'
import { filterAndPaginate } from '../array/filterAndPaginate'
import { compare } from '../compare/compare'

export interface PaginationLoadOptions<T> {
  page: number
  itemsPerPage: number
  search: string
  callback: (items: T[], totalItems: number) => void
  setItems: (items: T[]) => void
  params?: { [key: string]: any }
}

export interface PaginationOptions {
  search?: Ref<string>
  optionsDelay?: number
  serverSideRendering?: Ref<boolean>
  searchDelay?: number
  storePreviousItems?: boolean
  params?: Ref<{ [key: string]: any }>
}

export function pagination<T>(
  items: Ref<T[]>,
  page: Ref<number>,
  itemsPerPage: Ref<number>,
  callback: (options: PaginationLoadOptions<T>) => void,
  { serverSideRendering = ref(false), search = ref(''), searchDelay = 2500, storePreviousItems = false, params = ref({}), optionsDelay = 500 }: PaginationOptions = {},
) {
  const storedItems = ref<T[]>([]) as Ref<T[]>
  const internalItems = ref<T[]>([]) as Ref<T[]>
  const internalTotalItems = ref(0)

  const setData = (items: T[], totalItems: number, invalidate = false) => {
    if (storePreviousItems) {
      if (invalidate) {
        storedItems.value = []
      }

      storedItems.value.push(...items)
      internalItems.value = storedItems.value
    }
    else {
      internalItems.value = items
    }

    internalTotalItems.value = totalItems
  }

  const localRendering = ref(false)
  const isLoading = ref(false)

  const isSearching = ref(false)
  const computedSearchDelay = computed(() => (localRendering.value || !serverSideRendering.value ? optionsDelay : searchDelay))

  const load = () => {
    isLoading.value = true

    if (localRendering.value || !serverSideRendering.value) {
      const pagination = filterAndPaginate(items.value, {
        search: search.value || '',
        page: page.value,
        itemsPerPage: itemsPerPage.value,
      })

      isSearching.value = false
      isLoading.value = false
      setData(pagination.items, pagination.totalItems)

      return
    }

    const loadOptions: PaginationLoadOptions<T> = {
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      search: search.value || '',
      callback: (items: T[], totalItems: number) => {
        isSearching.value = false
        isLoading.value = false
        setData(items, totalItems)
      },
      setItems: (values: T[]) => {
        isSearching.value = false
        isLoading.value = false
        localRendering.value = true
        items.value = values
      },
      params: params.value,
    }

    callback(loadOptions)
  }

  const isWaiting = ref(false)
  const waitingTimer = ref<NodeJS.Timeout>()
  const waitingTimerDelay = computed(() => isSearching.value ? computedSearchDelay.value : optionsDelay)

  watch(
    [search, itemsPerPage, page],
    ([newSearch, newItemsPerPage], [oldSearch, oldItemsPerPage]) => {
      if (newSearch !== oldSearch) {
        isSearching.value = true
        page.value = 1
      }

      if (newItemsPerPage !== oldItemsPerPage) {
        page.value = 1
      }

      setData([], 0, isSearching.value || page.value === 1)

      isWaiting.value = true
      clearTimeout(waitingTimer.value)
      waitingTimer.value = setTimeout(() => {
        isWaiting.value = false
        load()
      }, waitingTimerDelay.value)
    },
  )

  watch([params, serverSideRendering, items], ([params], [oldParams]: any) => {
    const paramsChanged = !compare(params, oldParams, true)
    if (paramsChanged) {
      localRendering.value = false
    }

    setData([], 0, true)
    load()
  }, { immediate: true, deep: true })

  return {
    items: internalItems,
    totalItems: internalTotalItems,
    isLoading,
    isWaiting,
    isSearching,
    notifyDataSetChanged: () => {
      page.value = 1
      setData([], 0, true)
      load()
    },
  }
}
