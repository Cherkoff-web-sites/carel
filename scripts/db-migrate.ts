import { config } from 'dotenv'
import { resolve } from 'path'
import { Pool } from 'pg'
import { migrate } from '../lib/db/migrate'

config({ path: resolve(process.cwd(), '.env.local') })
config({ path: resolve(process.cwd(), '.env') })

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error('DATABASE_URL is not set')
  }

  const pool = new Pool({ connectionString: url })
  await migrate(pool)
  await pool.end()

  console.log('Migrations applied')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
