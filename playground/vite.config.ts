import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import type { VueComposableConfigs } from '@teranes/vue-composables/resolver'

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
  plugins: [vue()],
})
