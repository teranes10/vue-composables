import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('POPPER', {
    input: { popper: './src/index.ts' },
    external: ['@popperjs/core'],
    globals: {
      '@popperjs/core': 'Popper',
    },
  }),
]
