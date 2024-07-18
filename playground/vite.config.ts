import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueComposableImports, { type VueComposableConfigs } from '@teranes/vue-composables/resolver'

const global: VueComposableConfigs = {
  vueComposables: {
    currencyString: {
      addCents: true,
      symbol: 'Rs.',
    },
    date: {
      format: 'h:mm:ss a, Do MMM YYYY',
    },
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global,
  },
  plugins: [vue(), AutoImport({
    dts: 'composables-imports.d.ts',
    dirs: ['src/components/**', 'src/composables/**'],
    imports: ['vue', 'vue-router', 'pinia', ...VueComposableImports()],
  })],
})
