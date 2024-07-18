import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

function getExportNames(fileContent) {
  const exportsRegex = /export\s+(?:async\s+)?(\w+)\s+(\w+)/g
  const exportNames = new Map()

  let match
  while (true) {
    match = exportsRegex.exec(fileContent)
    if (match == null) {
      break
    }

    if (match[1] && match[2]) {
      exportNames.set(match[2], { type: match[1], name: match[2] })
    }
  }

  return Array.from(exportNames.values())
}

function getExternalExports(fileContent) {
  const exportExternalRegex = /export\s+\{([^}]+)\}/g
  const exportNames = new Map()

  let match
  while (true) {
    match = exportExternalRegex.exec(fileContent)
    if (match == null) {
      break
    }

    if (match[1]) {
      match[1]
        ?.replaceAll('\n', '')
        ?.trim()
        ?.split(',')
        ?.filter(z => !!z)
        ?.forEach((x) => {
          const parts = x
            .trim()
            .split(' as ')
            .map(y => y.trim())
          const isType = parts[0] === 'type'
          const name = parts[parts.length - 1]
          exportNames.set(name, { type: isType ? 'type' : '', name })
        })
    }
  }

  return Array.from(exportNames.values())
}

export function traverseFiles(dir, find = () => true, files = []) {
  for (const filename of fs.readdirSync(dir).slice().sort()) {
    const filePath = path.join(dir, filename)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      traverseFiles(filePath, find, files)
    }
    else if (find(filePath)) {
      files.push(filePath)
    }
  }

  return files
}

const rootDir = path.join(process.cwd(), './src')
const indexFile = path.join(process.cwd(), './src/index.ts')
const importsFile = path.join(process.cwd(), './src/imports.ts')
const resolverFile = path.join(process.cwd(), './src/resolver.ts')

const exclude = [indexFile, importsFile, resolverFile, /\/_base\.ts$/]

const exports = []

for (const filePath of traverseFiles(rootDir)) {
  if (exclude.some(x => x instanceof RegExp ? x.test(filePath) : x === filePath)) {
    continue
  }

  const fileContent = fs.readFileSync(filePath, 'utf8')

  exports.push({
    filePath,
    exports: [
      ...getExternalExports(fileContent),
      ...getExportNames(fileContent),
    ],
  })
}

const functions = []
const classes = []
const types = []

let indexFileContent = ''

for (const file of exports) {
  indexFileContent += `export {\n`

  for (const expo of file.exports) {
    indexFileContent += `\t${expo.type === 'type' || expo.type === 'interface' ? 'type ' : ''}${
      expo.name
    },\n`

    if (expo.type === 'type' || expo.type === 'interface') {
      types.push(expo.name)
    }
    else if (expo.type === 'class') {
      classes.push(expo.name)
    }
    else {
      functions.push(expo.name)
    }
  }

  indexFileContent += `} from '${file.filePath
    .replace(rootDir, '.')
    .replace('.ts', '')}';\n\n`
}

fs.writeFileSync(indexFile, indexFileContent, 'utf-8')

// composables
let importsFileContent = `export const Composables = [\n`

for (const func of functions) {
  importsFileContent += `\t"${func}",\n`
}

importsFileContent += `];`
importsFileContent += `\n\n`

// classes
importsFileContent += `export const ComposableClasses = [\n`

for (const className of classes) {
  importsFileContent += `\t"${className}",\n`
}

importsFileContent += `];`
importsFileContent += `\n\n`

// types
importsFileContent += `export const ComposableTypes = [\n`

for (const type of types) {
  importsFileContent += `\t"${type}",\n`
}

importsFileContent += `];`

fs.writeFileSync(importsFile, importsFileContent, 'utf-8')
