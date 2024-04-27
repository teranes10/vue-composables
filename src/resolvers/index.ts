export const ComposablesAutoImport = {
  "@teranes/vue-composables": [
    "useGetAccessedProps", "useFunctionCaller", "useGetParameters",
    "useGetFromStorage", "useSetToStorage",
    "useStringTemplateWithReplacements",
    "useNumberDiff", "useToNumericString", "useToFormattedNumericString", "useToCurrencyString", "useToNumber",
    "usePaginate", "usePaginationHandler", "useFilter", "useFilterAndPaginate",
    "useIsNull", "useIsNullOrEmptyObject", "useMapper", "useCloneDeep", "useCoalesce", "useCoalesceTruthy", "useObjectValueByPath",
    "useObjectAssign", "useValueAssign",
    "useObjectCompare", "useArrayCompare", "useValueCompare",
    "useVModel",

    "useDebounce",
    "useDraggable",
    "useInfiniteScroll",
    "useEventListener", "useIsEventInsideElement",
    "useThrottle",

    "useExportCsv",
    "useExportDataTablePdf", "useExportDataTablePrint",

    "usePopper"
  ],
};

export const ComposablesTypesAutoImport = {
  from: "@teranes/vue-composables",
  imports: [
    'PagerLoadOptions',
    'Popper'
  ],
  type: true,
};