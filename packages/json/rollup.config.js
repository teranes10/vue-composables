import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('JSON', {
    input: { json: './src/index.ts' },
  }),
]
