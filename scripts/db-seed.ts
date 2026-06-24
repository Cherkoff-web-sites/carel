import { config } from 'dotenv'
import { resolve } from 'path'
import { closeDb, getDb } from '../lib/db/client'
import { getProductCount, reseedFromCatalogFile, resolveInitialCatalogSync } from '../lib/db/seed'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

async function main() {
  const force = process.argv.includes('--force')
  const db = await getDb()

  if (force) {
    await reseedFromCatalogFile(db, resolveInitialCatalogSync())
    console.log('Catalog reseeded (forced)')
  } else {
    const count = await getProductCount(db)
    console.log(`Products in database: ${count}`)
  }

  await closeDb()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
