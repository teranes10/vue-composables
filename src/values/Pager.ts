import { computed, ref, watch, type Ref } from "vue";

export function usePaginationHandler<T>(
  items: Ref<T[]>,
  page: Ref<number>,
  itemsPerPage: Ref<number>,
  callback: (options: LoadOptions<T>) => void,
  { serverSideRendering, search, searchDelay, storePreviousItems, params }: Options = {}
) {
  const storedItems = ref<T[]>([]) as Ref<T[]>;
  const internalItems = ref<T[]>([]) as Ref<T[]>;
  const internalTotalItems = ref(0);

  const setData = (items: T[], totalItems: number) => {
    if (serverSideRendering?.value && storePreviousItems) {
      if (page.value === 1) {
        storedItems.value = [];
      }
      storedItems.value.push(...items);
      internalItems.value = storedItems.value;
    } else {
      internalItems.value = items;
    }

    internalTotalItems.value = totalItems;
  };

  const isLoading = ref(false);
  const load = () => {
    isLoading.value = true;

    if (serverSideRendering?.value) {
      const loadOptions: LoadOptions<T> = {
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        search: search?.value || "",
        callback: (items: T[], totalItems: number) => {
          isSearching.value = false;
          isLoading.value = false;
          setData(items, totalItems);
        },
        params: params?.value
      };

      callback(loadOptions);
    } else {
      const pagination = useFilterAndPaginate(items.value, {
        search: search?.value || "",
        page: page.value,
        itemsPerPage: itemsPerPage.value,
      });

      isSearching.value = false;
      isLoading.value = false;
      setData(pagination.items, pagination.totalItems);
    }
  };

  const isSearching = ref(false);
  const computedSearchDelay = computed(
    () => searchDelay || (serverSideRendering?.value ? 2500 : 500)
  );

  const loadingTimer = ref<NodeJS.Timeout>();
  const loadingTimerDelay = computed(() =>
    isSearching.value ? computedSearchDelay.value : 500
  );

  watch(
    [search, itemsPerPage, page],
    ([newSearch, newItemsPerPage], [oldSearch, oldItemsPerPage]) => {
      if (newSearch !== oldSearch) {
        isSearching.value = true;
        page.value = 1;
      }

      if (newItemsPerPage != oldItemsPerPage) {
        page.value = 1;
      }

      if (page.value === 1) {
        storedItems.value = [];
      }

      clearTimeout(loadingTimer.value);
      loadingTimer.value = setTimeout(load, loadingTimerDelay.value);
    }
  );

  watch([serverSideRendering, items, params], () => {
    load()
  }, { immediate: true, deep: true })

  return {
    items: internalItems,
    totalItems: internalTotalItems,
    isLoading: isLoading,
    notifyDataSetChanged: () => {
      page.value = 1;
      load();
    }
  };
}

export function useFilterAndPaginate<T>(
  items: T[],
  options: { search?: string; page: number; itemsPerPage: number }
) {
  const filteredItems = useFilter(items, options.search || "");
  const paginatedItems = usePaginate(
    filteredItems,
    options.page,
    options.itemsPerPage
  );

  return { items: paginatedItems, totalItems: filteredItems.length };
}

export function useFilter<T>(items: T[], search: string) {
  const filter = search?.trim()?.toLowerCase() || "";

  const includes = (item: T) => {
    if (item && typeof item === 'object') {
      return Object.keys(item || {}).some((key) =>
        (item as any)[key]?.toString()?.toLowerCase()?.includes(filter)
      );
    }

    return item?.toString()?.toLowerCase()?.includes(filter);
  };

  return items?.filter((item) => includes(item)) || [];
}

export function usePaginate<T>(items: T[], page: number, itemsPerPage: number) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return items?.slice(start, end) || [];
}

export type LoadOptions<T> = {
  page: number;
  itemsPerPage: number;
  search: string;
  callback: (items: T[], totalItems: number) => void;
  params?: { [key: string]: any }
};

export type Options = {
  serverSideRendering?: Ref<boolean>,
  search?: Ref<string>;
  searchDelay?: number;
  storePreviousItems?: boolean;
  params?: Ref<{ [key: string]: any }>
};
