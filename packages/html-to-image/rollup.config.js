import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('HTML_TO_IMAGE', {
    external: ['vue', '@teranes/vue-composables', '@teranes/short-unique-id'],
    globals: {
      vue: 'Vue',
      '@teranes/vue-composables': 'VUE_COMPOSABLES',
      '@teranes/short-unique-id': 'SHORT_UNIQUE_ID'
    }
  })
]
