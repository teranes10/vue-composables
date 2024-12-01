import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('WORDS', {
    input: { words: './src/index.ts' },
  }),
]
