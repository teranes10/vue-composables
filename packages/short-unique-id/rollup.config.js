import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('SHORT_UNIQUE_ID', {
    input: { 'short-unique-id': './src/index.ts' },
  }),
]
