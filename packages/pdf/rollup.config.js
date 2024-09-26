import { libraryConfig } from '../../rollup.config.js'

export default [
  ...libraryConfig('PDF', {
    external: ['vue', '@teranes/html-to-image', '@teranes/utils', 'jspdf', 'jspdf-autotable'],
    globals: {
      vue: 'Vue',
      '@teranes/html-to-image': 'HTML_TO_IMAGE',
      '@teranes/utils': 'UTILS',
      'jspdf': 'jsPDF',
      'jspdf-autotable': 'autoTable'
    }
  })
]
