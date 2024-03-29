import { defineBuildConfig } from 'unbuild'
import ExportCollector from 'unplugin-export-collector/rollup'

import alias from './alias'

// import pkg from './package.json'

export default defineBuildConfig({
  declaration: true,
  // externals: Object.keys(pkg.dependencies || {}),
  rollup: {
    esbuild: {
      minify: true,
    },
    inlineDependencies: true,
  },
  alias,
  hooks: {
    'rollup:options': (_, options) => {
      options.plugins = [
        ...(options.plugins as any[]),
        ExportCollector(),
      ]
    },
  },
})
