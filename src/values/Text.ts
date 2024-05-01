import pluralize from 'pluralize'

export function useIsPlural(word: string) {
    return pluralize.isPlural(word)
}

export function usePlural(word: string) {
    return pluralize.plural(word)
}

export function useIsSingular(word: string) {
    return pluralize.isSingular(word)
}

export function useSingular(word: string) {
    return pluralize.singular(word)
}