import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('CSV', {
    input: { csv: './src/index.ts' },
  }),
]
