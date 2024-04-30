import pluralize from 'pluralize'

export function useIsPlural(word: string) {
    pluralize.isPlural(word)
}

export function usePlural(word: string) {
    pluralize.plural(word)
}

export function useIsSingular(word: string) {
    pluralize.isSingular(word)
}

export function useSingular(word: string) {
    pluralize.singular(word)
}