import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('VUE_COMPOSABLES', {
    input: { 'vue-composables': './src/index.ts' },
    external: ['@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@teranes/utils'],
    globals: { '@vue/runtime-core': 'Vue', '@vue/runtime-dom': 'Vue', '@vue/reactivity': 'Vue', '@teranes/utils': 'UTILS' },
  }),
]
