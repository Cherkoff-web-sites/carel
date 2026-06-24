import { closeDb, getDb } from '../lib/db/client'
import { getProductCount } from '../lib/db/seed'

async function main() {
  const db = await getDb()
  const count = await getProductCount(db)

  console.log('PostgreSQL ready')
  console.log(`Products in database: ${count}`)

  await closeDb()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
