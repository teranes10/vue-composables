import { upperFirst } from 'lodash-es'
import { toCamelCase } from './toCamelCase'

export function toPascalCase(value: string) {
  return upperFirst(toCamelCase(value))
}
