import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/resolver.ts'],
  format: ['esm', 'cjs'],
  target: 'esnext',
  platform: 'browser',
  dts: true,
  external: ['vue'],
  minify: false,
  splitting: true,
  clean: true,
})
