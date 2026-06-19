import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { buildCatalogSeed } from '../lib/catalogSeed'

const outDir = join(process.cwd(), 'data-default')
const outFile = join(outDir, 'catalog.json')

mkdirSync(outDir, { recursive: true })
writeFileSync(outFile, JSON.stringify(buildCatalogSeed(), null, 2), 'utf-8')

console.log(`Wrote ${outFile}`)
