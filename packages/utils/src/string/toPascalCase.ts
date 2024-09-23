import { capitalize } from './capitalize'
import { toCamelCase } from './toCamelCase'

export function toPascalCase(value: string) {
  return capitalize(toCamelCase(value))
}
