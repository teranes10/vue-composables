import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve, basename, extname } from 'path';
import { resolve as metaResolve } from 'import-meta-resolve'
import ts from 'typescript'

const namingConvention = {
    type: 'types',
    interface: 'interfaces',
    class: 'classes',
    function: 'functions',
    const: 'constants',
    let: 'lets',
    var: 'vars'
}

function getTsNodes(sourceFile) {
    const children = []
    ts.forEachChild(sourceFile, (node) => {
        children.push(node)
    })
    return children;
}

async function getFileExports(filePath, exportName) {
    const sourceFile = ts.createSourceFile(
        filePath,
        fs.readFileSync(filePath, 'utf8'),
        ts.ScriptTarget.Latest,
        true
    );

    const exports = new Map();

    for (const node of getTsNodes(sourceFile)) {
        const internalExports = getNodeExportDetails(node, exportName);
        if (internalExports) {
            if (Array.isArray(internalExports)) {
                for (const _export of internalExports) {
                    exports.set(_export.name, _export)
                }
            } else {
                return internalExports
            }
        }

        const externalExports = await getNodeExternalExportDetails(node, exportName);
        if (externalExports) {
            if (Array.isArray(externalExports)) {
                for (const _export of externalExports) {
                    exports.set(_export.name, _export)
                }
            } else {
                return externalExports
            }
        }
    }

    return exportName ? undefined : exports.values()
}

function getNodeExportDetails(node, exportName) {
    if (!node.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) {
        return []
    }

    const exports = [];

    if (ts.isVariableStatement(node)) {
        const type = node.declarationList.flags === ts.NodeFlags.Const
            ? 'const'
            : node.declarationList.flags === ts.NodeFlags.Let
                ? 'let'
                : 'var'

        node.declarationList.declarations.forEach(declaration => {
            if (ts.isIdentifier(declaration.name)) {
                exports.push({ name: declaration.name.getText(), type })
            }
        });
    } else if (ts.isFunctionDeclaration(node) && node.name) {
        exports.push({ name: node.name.getText(), type: 'function' });
    } else if (ts.isClassDeclaration(node) && node.name) {
        exports.push({ name: node.name.getText(), type: 'class' });
    } else if (ts.isInterfaceDeclaration(node) && node.name) {
        exports.push({ name: node.name.getText(), type: 'interface' });
    } else if (ts.isTypeAliasDeclaration(node) && node.name) {
        exports.push({ name: node.name.getText(), type: 'type' });
    }

    return exportName ? exports.find(x=>x.name === exportName) : exports;
}

async function getNodeExternalExportDetails(node, exportName) {
    if (!ts.isExportDeclaration(node)) {
        return exportName ? undefined : []
    }

    const filePath = node.getSourceFile().fileName;
    if (!filePath) {
        return exportName ? undefined : []
    }
    
    const exports = []

    if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        const elements = node.exportClause.elements;
        if (elements) {
            for (const el of elements) {
                const exportName = el.name.getText();
                const actualName = el.propertyName?.getText() || exportName

                const moduleOrFilePath = node.moduleSpecifier?.getText().replace(/['"]/g, '') || undefined
                const isModule = !(moduleOrFilePath.startsWith('./') || moduleOrFilePath.startsWith('../'))
                if (isModule) {
                    const url = pathToFileURL(filePath).href
                    const moduleFileUrl = metaResolve(moduleOrFilePath, url)
                    const moduleFilePath = fileURLToPath(moduleFileUrl)

                    const actualExport = await getModuleExports(moduleFilePath, actualName)
                    exports.push({ name: exportName, type: actualExport.type})
                } else {
                    const _filePath = resolve(dirname(filePath), moduleOrFilePath);
                    const dir = dirname(_filePath)
                    const filename = basename(_filePath)
                    const files = fs.readdirSync(dir)?.filter(x => x?.startsWith(filename))
                    if (files.length === 1) {
                        const ext = extname(files[0])
                        const actualExport = await getFileExports(_filePath + ext, actualName)
                        exports.push({ name: exportName, type: actualExport.type })
                    } else {
                        console.error("unable to determine the file", {filename});
                    }
                }
            }
        }
    } else if (!node.exportClause) {
        // exports.push({
        //     name: '*',
        //     type: 'wildcard export',
        //     from: node.moduleSpecifier?.getText().replace(/['"]/g, '') || undefined
        // });
    }

    return exports;
}

async function getModuleExports(modulePath, exportName) {
    const module = (await import(modulePath)).default;
    if (!module) {
        return []
    }

    const exports = []

    for (const key in module) {
        const item = module[key]
        if (!item) {
            return
        }

        let exportItem;

        if (typeof item === 'function') {
            exportItem = { name: key, type: 'function' }
        } else if (typeof item === 'object' && item instanceof Object) {
            exportItem = { name: key, type: 'class' }
        } else if (typeof item === 'string' || typeof item === 'number') {
            exportItem = { name: key, type: 'const' }
        } else if (typeof item === 'object') {
            exportItem = { name: key, type: 'type' }
        }

        if (exportItem) {
            if (key === exportName) {
                return exportItem
            }

            exports.push(exportItem)
        }
    }

    return exportName ? undefined : exports;
}

function traverseFiles(dir, find = () => true, files = []) {
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

export async function processExportFiles({
    url,
    rootDir = './src',
    indexFile = './src/index.ts',
    exportsFile = './src/exports.ts',
    excludes = [],
} = {}) {
    const _rootDir = resolvePath(url, rootDir)
    const _indexFile = resolvePath(url, indexFile)
    const _exportsFile = resolvePath(url, exportsFile)
    const _excludes = [_indexFile, _exportsFile, /\/_base\.ts$/, /test\.ts$/, /\.md$/, ...excludes]

    const exports = []

    for (const filePath of traverseFiles(_rootDir)) {
        if (_excludes.some(x => x instanceof RegExp ? x.test(filePath) : x === filePath)) {
            continue
        }

        exports.push({
            filePath,
            exports: await getFileExports(filePath)
        })
    }
    
    const exportTypes = {}

    // create index file
    let indexFileContent = ''

    for (const file of exports) {
        indexFileContent += `export {\n`

        for (const expo of file.exports) {
            indexFileContent += `\t${expo.type === 'type' || expo.type === 'interface' ? 'type ' : ''}${expo.name},\n`

            exportTypes[expo.type] ??= []
            exportTypes[expo.type].push(expo.name)
        }

        indexFileContent += `} from '${file.filePath
            .replace(_rootDir, '.')
            .replace('.ts', '')}';\n\n`
    }

    fs.writeFileSync(_indexFile, indexFileContent, 'utf-8')

    // create exports files
    let exportsFileContent = ''

    Object.keys(exportTypes).forEach(type => {
        exportsFileContent += `export const ${namingConvention[type]} = [\n`

        exportTypes[type].forEach(name => {
            exportsFileContent += `\t"${name}",\n`
        })

        exportsFileContent += `];`
        exportsFileContent += `\n\n`
    })

    fs.writeFileSync(_exportsFile, exportsFileContent, 'utf-8')
}

export function resolvePath(url, filePath) {
    const __filename = fileURLToPath(url);
    const __dirname = dirname(__filename);

    return path.join(__dirname, filePath)
}