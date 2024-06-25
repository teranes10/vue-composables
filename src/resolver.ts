import { ComposableTypes, Composables } from './imports'
import { toCamelCase } from './string/toCamelCase'

interface Options {
  prefix?: string
}

export default function VueComposableImports({ prefix = 'use' }: Options = {}) {
  return [
    {
      '@teranes/vue-composables': Composables.map(name => [name, toCamelCase(`${prefix} ${name}`)]),
    },
    {
      from: '@teranes/vue-composables',
      imports: ComposableTypes,
      type: true,
    },
  ]
}
