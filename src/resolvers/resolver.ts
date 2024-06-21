export const ComposablesAutoImport = {
  "@teranes/vue-composables": [
    "useGetAccessedProps", "useFunctionCaller", "useGetParameters",
    "useGetFromStorage", "useSetToStorage",
    "useCamelCase", "useSnakeCase", "useKebabCase", "usePascalCase", "useStringTemplateWithReplacements",
    "useNumberDiff", "useToNumericString", "useToFormattedNumericString", "useToCurrencyString", "useToNumber",
    "usePaginate", "usePaginationHandler", "useFilter", "useFilterAndPaginate",
    "useCloneDeep", "useMapKeys", "useMapValues", "useIsPlainObject", "useIsArray", "useObjectValueByPath", "useIsNull", "useCoalesce", "useCoalesceTruthy", "useMapper", "useIsNullOrEmptyObject",
    "useObjectAssign", "useValueAssign",
    "useObjectCompare", "useArrayCompare", "useValueCompare",
    "useShortUniqueId",
    "useVModel",

    "useDebounce",
    "useDraggable",
    "useInfiniteScroll",
    "useEventListener", "useIsEventInsideElement",
    "useThrottle",

    "useExportCsv",
    "useExportDataTablePdf", "useExportDataTablePrint",
    "useGetBackgroundColor", "useHtmlToImage",

    "usePopper",

    "useIsPlural", "useIsSingular", "usePlural", "useSingular",
    "useCamelCaseJson", "useJsonStringFormatter",
    "useDate", "useIsValidDate",
    "useCsvReader",
    "useHexColorShade", "useHexToFilter", "useHexToHsl", "useHslToFilter", "useHslToHex"
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