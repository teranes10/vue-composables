import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/resolver.ts'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  platform: 'browser',
  dts: {
    resolve: true,
  },
  external: ['vue'],
  minify: true,
  splitting: true,
  clean: true,
})
