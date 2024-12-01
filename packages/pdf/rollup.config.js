import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('PDF', {
    input: { pdf: './src/index.ts' },
    external: ['@vue/runtime-core', '@vue/runtime-dom', '@teranes/html-to-image', '@teranes/utils', 'jspdf', 'jspdf-autotable'],
    globals: {
      '@vue/runtime-core': 'Vue',
      '@vue/runtime-dom': 'Vue',
      '@teranes/html-to-image': 'HTML_TO_IMAGE',
      '@teranes/utils': 'UTILS',
      'jspdf': 'jsPDF',
      'jspdf-autotable': 'autoTable',
    },
  }),
]
