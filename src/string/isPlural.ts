import pluralize from 'pluralize'

export function isPlural(word: string) {
  return pluralize.isPlural(word)
}
