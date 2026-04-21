import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema.js'


const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbHost = process.env.DB_HOST
const dbName = process.env.DB_NAME

const connection = `postgres://${dbUser}:${dbPassword}@${dbHost}:5432/${dbName}`

const db = drizzle({
  connection,
  schema
})

export default db
