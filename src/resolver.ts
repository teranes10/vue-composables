import type { DateOptions } from './date/date'
import { ComposableClasses, ComposableTypes, Composables } from './imports'
import { toCamelCase } from './string/toCamelCase'
import type { CurrencyStringOptions } from './string/toCurrencyString'

export interface VueComposableImportOptions {
  prefix?: string
  classPrefix?: string
  typePrefix?: string
}

export default function VueComposableImports({ prefix = 'use', classPrefix = '', typePrefix = '' }: VueComposableImportOptions = {}): any {
  return [
    {
      from: '@teranes/vue-composables',
      imports: [
        ...Composables.map(name => [name, toCamelCase(`${prefix} ${name}`)]),
        ...ComposableClasses.map(name => [name, `${classPrefix}${name}`]),
      ],
    },
    {
      from: '@teranes/vue-composables',
      imports: ComposableTypes.map(name => [name, `${typePrefix}${name}`]),
      type: true,
    },
  ]
}

export { ComposableTypes, Composables }
export interface VueComposableConfigs {
  vueComposables: Partial<{
    currencyString?: Partial<CurrencyStringOptions>
    date?: Partial<DateOptions>
  }>
}

export function getGlobalConfigs<K extends keyof VueComposableConfigs['vueComposables']>(type: K): NonNullable<VueComposableConfigs['vueComposables'][K]> {
  return (globalThis?.global as any)?.vueComposables?.[type] || {}
}
