import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/resolvers/resolver.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    minify: true,
    splitting: true,
    clean: true,
    esbuildOptions: (options) => {
        options.external = ['vue'];
    },
});