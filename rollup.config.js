import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import dts from 'rollup-plugin-dts';
import summary from 'rollup-plugin-summary';
import del from 'rollup-plugin-delete'
import alias from '@rollup/plugin-alias';

export function libraryConfig(name, {
  input = './src/index.ts',
  exports = './src/exports.ts',
  aliasEntries = [],
  external = [],
  globals = {}
} = {}) {

  return [{
    input,
    output: [
      {
        dir: 'dist',
        entryFileNames: `index.mjs`,
        exports: 'named',
        format: 'es',
        preserveModules: true,
      },
      {
        dir: 'dist',
        entryFileNames: `index.cjs`,
        format: 'cjs',
      },
      {
        dir: 'dist',
        entryFileNames: `index.umd.js`,
        format: 'umd',
        name: name,
        globals
      },
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
    },
    external,
    plugins: [
      del({ targets: 'dist/*' }),
      alias({
        entries: aliasEntries
      }),
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      json(),
      commonjs(),
      nodePolyfills(),
      typescript(),
      terser(),
      summary(),
    ],
  },
  {
    input: exports,
    output: [
      {
        dir: 'dist',
        entryFileNames: `exports.mjs`,
        exports: 'named',
        format: 'es',
      },
      {
        dir: 'dist',
        entryFileNames: `exports.cjs`,
        format: 'cjs',
      },
    ],
    plugins: [
      typescript(),
      terser(),
    ],
  },

  {
    input: './src/index.ts',
    output: [
      {
        file: `dist/index.d.ts`,
      },
    ],
    plugins: [
      dts({ respectExternal: false}),
    ],
  },
  ]
}