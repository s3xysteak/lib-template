import { execSync } from 'node:child_process'
import { expGenerator } from 'export-collector'

await expGenerator('./src')

execSync('unbuild', { stdio: 'inherit' })
