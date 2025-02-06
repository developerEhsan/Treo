import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: 'src/main/drizzle/schema.ts',
  out: 'resources/database/migrations',
  dialect: 'sqlite',
  strict: true,
  verbose: true,
  dbCredentials: { url: 'resources/database/data.db' }
})
