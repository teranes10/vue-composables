import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('DATE', {
    input: { date: './src/index.ts' },
  }),
]
