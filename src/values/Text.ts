import { isPlural, plural, isSingular, singular } from 'pluralize'

export function useIsPlural(word: string) {
    return isPlural(word)
}

export function usePlural(word: string) {
    return plural(word)
}

export function useIsSingular(word: string) {
    return isSingular(word)
}

export function useSingular(word: string) {
    return singular(word)
}