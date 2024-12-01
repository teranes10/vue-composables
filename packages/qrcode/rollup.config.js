import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('QRCODE', {
    input: { 'qr-code': './src/index.ts' },
  }),
]
