import pluralize from 'pluralize'

export function toPlural(word: string) {
  return pluralize.plural(word)
}
