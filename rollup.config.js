import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import dts from 'rollup-plugin-dts'
import summary from 'rollup-plugin-summary'
import del from 'rollup-plugin-delete'
import alias from '@rollup/plugin-alias'
import { toKebabCase } from '@teranes/utils'

export function libraryConfig(name, {
  input = './src/index.ts',
  exports = './src/exports.ts',
  aliasEntries = [],
  external = [],
  globals = {},
} = {}) {
  return [{
    input,
    output: [
      {
        dir: 'dist',
        entryFileNames: esEntryFileNames,
        exports: 'named',
        format: 'es',
        preserveModules: true,
      },
      {
        dir: 'dist',
        entryFileNames: `[name].cjs`,
        format: 'cjs',
      },
      {
        dir: 'dist',
        entryFileNames: `[name].umd.js`,
        format: 'umd',
        name,
        globals,
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
        entries: aliasEntries,
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      json(),
      commonjs(),
      nodePolyfills(),
      typescript(),
      terser(),
      summary(),
    ],
  }, {
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
  }, {
    input: './src/index.ts',
    output: [
      {
        file: `dist/${Object.keys(input)[0]}.d.ts`,
        format: 'es',
      },
    ],
    plugins: [
      dts({ respectExternal: false }),
    ],
  }, {
    input: './src/exports.ts',
    output: [
      {
        file: `dist/exports.d.ts`,
        format: 'es',
      },
    ],
    plugins: [
      dts({ respectExternal: false }),
    ],
  }]
}

function esEntryFileNames(info) {
  if (info.isEntry) {
    return `[name].mjs`
  }

  if (info.name.includes('node_modules')) {
    const parts = info.name.split('/').reverse()
    const index = parts.indexOf('node_modules')
    if (index > -1) {
      const part = toKebabCase(parts[0])
      const name = part === 'index' ? `_${parts[index - 1]}` : `_${part}`
      return `es-chunks/${name}.mjs`
    }
  }

  if (info.name.startsWith('_virtual')) {
    return `es-chunks/_${info.name.split('/')[1]}.mjs`
  }

  return `es-chunks/${idToName(info.name)}.mjs`
}

function idToName(id) {
  const [folderName, fileName] = id.split('/').slice(-2)
  if (folderName === 'es-chunks') {
    return fileName
  }

  return folderName
}
