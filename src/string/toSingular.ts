import pluralize from 'pluralize'

export function toSingular(word: string) {
  return pluralize.singular(word)
}
