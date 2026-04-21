import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

import db from '@/db/index.js'


try {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  await migrate(db, { migrationsFolder: resolve(__dirname, 'migrations') })

  console.log('Migrations applied successfully')
  process.exit(0)
} catch (error) {
  console.error('Error applying migrations:', error)
  process.exit(1)
}
