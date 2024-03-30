import { computed, ref, watch, type Ref } from "vue";
import { useValueCompare } from "./ObjectCompare";

export function usePaginationHandler<T>(
  items: Ref<T[]>,
  page: Ref<number>,
  itemsPerPage: Ref<number>,
  callback: (options: LoadOptions<T>) => void,
  { serverSideRendering = ref(false), search = ref(''), searchDelay = 2500, storePreviousItems = false, params = ref({}), optionsDelay = 500 }: Options = {}
) {

  const storedItems = ref<T[]>([]) as Ref<T[]>;
  const internalItems = ref<T[]>([]) as Ref<T[]>;
  const internalTotalItems = ref(0);

  const setData = (items: T[], totalItems: number, invalidate = false) => {
    if (serverSideRendering.value && storePreviousItems) {
      if (page.value === 1 || invalidate) {
        storedItems.value = [];
      }

      storedItems.value.push(...items);
      internalItems.value = storedItems.value;
    } else {
      internalItems.value = items;
    }

    internalTotalItems.value = totalItems;
  };

  const localRendering = ref(false);
  const isLoading = ref(false);

  const load = () => {
    isLoading.value = true;
    setData([], 0, true);

    if (localRendering.value || !serverSideRendering.value) {
      const pagination = useFilterAndPaginate(items.value, {
        search: search.value || "",
        page: page.value,
        itemsPerPage: itemsPerPage.value,
      });

      isSearching.value = false;
      isLoading.value = false;
      setData(pagination.items, pagination.totalItems);

      return;
    }

    const loadOptions: LoadOptions<T> = {
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      search: search.value || "",
      callback: (items: T[], totalItems: number) => {
        isSearching.value = false;
        isLoading.value = false;
        setData(items, totalItems);
      },
      setItems: (values: T[]) => {
        isSearching.value = false;
        isLoading.value = false;
        localRendering.value = true;
        items.value = values;
      },
      params: params.value
    };

    callback(loadOptions);

  };

  const isSearching = ref(false);
  const computedSearchDelay = computed(() => (localRendering.value || !serverSideRendering.value ? optionsDelay : searchDelay));

  const isWaiting = ref(false);
  const waitingTimer = ref<NodeJS.Timeout>();
  const waitingTimerDelay = computed(() => isSearching.value ? computedSearchDelay.value : optionsDelay);

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

      isWaiting.value = true;
      setData([], 0, true)

      clearTimeout(waitingTimer.value);
      waitingTimer.value = setTimeout(() => {
        isWaiting.value = false;
        load();
      }, waitingTimerDelay.value);
    }
  );

  watch([params, serverSideRendering, items],
    ([params], [oldParams]: any) => {
      const paramsChanged = !useValueCompare(params, oldParams, true);
      if (paramsChanged) {
        localRendering.value = false;
      }

      load()
    }, { immediate: true, deep: true })

  return {
    items: internalItems,
    totalItems: internalTotalItems,
    isLoading,
    isWaiting,
    isSearching,
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
  setItems: (items: T[]) => void;
  params?: { [key: string]: any }
};

export type Options = {
  search?: Ref<string>;
  optionsDelay?: number;
  serverSideRendering?: Ref<boolean>,
  searchDelay?: number;
  storePreviousItems?: boolean;
  params?: Ref<{ [key: string]: any }>
};
