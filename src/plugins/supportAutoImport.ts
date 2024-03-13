import { join, parse } from 'node:path'
import { readdirSync, writeFileSync } from 'node:fs'
import * as process from 'node:process'
import type { Plugin } from 'vite'
import type { PluginOptions } from 'vite-plugin-dts'

const targetDir = 'src/core'

const concatList = ['useViewerProvider', 'getViewer', 'setViewer']
const ignoreDirList = ['viewerStore']

const joinWithCwd = (path: string) => join(process.cwd(), path)

const removeExtension = (filePath: string) => parse(filePath).name

export function supportAutoImportPlugin(): Plugin {
  return {
    name: 'support-auto-import-plugin',
    apply: 'build',
    transform(code, id) {
      if (id.endsWith('src/index.ts')) {
        const dirNameList = readdirSync(targetDir)
          .filter(file => ignoreDirList.every(i => i !== file))
          .map(removeExtension)

        const resultArrString = JSON.stringify([...concatList, ...dirNameList])
        const result = `
          map => {
            const arr = ${resultArrString}
      
            return {
              'lib-template': arr.map(v => map && map[v] ? [v, map[v]] : v),
            }
          }
        `

        return `\n` + `export const autoImport = ${result};` + `\n${code}`
      }
    },
  }
}

export const supportAutoImportDts: PluginOptions['afterBuild'] = (dtsMap) => {
  const dirNameList = readdirSync(targetDir).filter(file =>
    ignoreDirList.every(i => i !== file),
  )
  const resultArr = [...concatList, ...dirNameList]
  const mapType = `Partial<Record<'${resultArr.join('\'|\'')}', string>>`
  const result = `export declare const autoImport: (map?: ${mapType}) => { 'lib-template': (string | [string, string])[] };`

  const path = joinWithCwd('./dist/index.d.ts').replace(/\\/g, '/')

  writeFileSync(path, `${dtsMap.get(path)}\n${result}\n`)
}
