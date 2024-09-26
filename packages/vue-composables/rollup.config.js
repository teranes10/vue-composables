import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('VUE_COMPOSABLES', {
    external: ['vue', '@teranes/utils'],
    globals: { vue: 'Vue', '@teranes/utils': 'UTILS'}
  })
]
