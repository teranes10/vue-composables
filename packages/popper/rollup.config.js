import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('POPPER', {
    external: ['@popperjs/core'],
    globals: {
      '@popperjs/core': 'popper',
    }
  })
]
