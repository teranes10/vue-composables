import pluralize from 'pluralize'

export function isSingular(word: string) {
  return pluralize.isSingular(word)
}
