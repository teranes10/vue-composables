import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('UTILS', {
    input: { utils: './src/index.ts' },
  }),
]
