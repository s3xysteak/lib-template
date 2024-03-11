/// <reference types="vitest" />

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

import AutoImport from 'unplugin-auto-import/vite'
import dts from 'vite-plugin-dts'

// import pkg from './package.json'

export default defineConfig({
  plugins: [
    dts({ rollupTypes: true }),
    AutoImport({
      imports: ['vitest'],
      dts: 'types/auto-imports.d.ts'
    })
  ],
  build: {
    lib: {
      formats: ['es', 'cjs', 'umd', 'iife'],
      entry: './src/index.ts',
      name: 'libTemplate',
      fileName: 'index'
    }
    // rollupOptions: {
    //   external: Object.keys(pkg.dependencies || {})
    // }
  },
  test: {
    environment: 'node',
    exclude: [
      ...configDefaults.exclude,
      'e2e/*',
      '**/public/**',
      '**/.{vscode,svn}/**'
    ],
    root: fileURLToPath(new URL('./', import.meta.url))
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
