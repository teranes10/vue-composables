import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('HTML_TO_IMAGE', {
    input: { 'html-to-image': './src/index.ts' },
    external: ['@vue/runtime-core', '@vue/runtime-dom', '@vue/reactivity', '@teranes/vue-composables', '@teranes/short-unique-id'],
    globals: {
      '@vue/runtime-core': 'Vue',
      '@vue/runtime-dom': 'Vue',
      '@vue/reactivity': 'Vue',
      '@teranes/vue-composables': 'VUE_COMPOSABLES',
      '@teranes/short-unique-id': 'SHORT_UNIQUE_ID',
    },
  }),
]
