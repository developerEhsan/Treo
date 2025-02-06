import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
// import dbPath from '../../../resources/database/data.db?asset&asarUnpack'
// import migrationPath from '../../../resources/database/migrations?asset&asarUnpack'
const dbPath = import.meta.env.DEV
  ? 'resources/database/data.db'
  : join(app.getPath('userData'), 'data.db')

console.log(dbPath)

const migrationPath = import.meta.env.DEV
  ? 'resources/database/migrations'
  : join(__dirname, '../../resources/database/migrations')

if (!existsSync(migrationPath)) {
  mkdirSync(migrationPath, { recursive: true })
}

// Initialize SQLite Database
const sqlite = new Database(dbPath)
sqlite.pragma('journal_mode = WAL')
// Initialize Drizzle ORM
const db = drizzle({ client: sqlite, schema, logger: import.meta.env.DEV })

const runMigrate = (): void => {
  try {
    migrate(db, {
      migrationsFolder: migrationPath
    })
  } catch (error) {
    console.error('Error while migration DB', error)
    throw Error(error as never)
  }
}
export { db, runMigrate }
