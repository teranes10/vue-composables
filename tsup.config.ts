export const baseConfig = {
  format: ['esm', 'cjs'],
  target: 'esnext',
  platform: 'browser',
  dts: {
    resolve: true,
  },
  minify: true,
  splitting: false,
  clean: true,
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    }
  },
} as any