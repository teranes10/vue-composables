import { extractWords } from './extractWords'
import { toString } from './toString'
import { capitalize } from './capitalize'

export function toCamelCase(string: string) {
  return extractWords(toString(string).replace(/['\u2019]/g, '')).reduce((result, word, index) => {
    word = word.toLowerCase()
    return result + (index ? capitalize(word) : word)
  }, '')
}
