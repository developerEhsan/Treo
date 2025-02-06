import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Define ClipboardType as a tuple (optimized for Drizzle & TypeScript)
export const ClipboardType = ['text', 'file'] as const
export type ClipboardTypeType = (typeof ClipboardType)[number] // "text" | "file"

// Define SQLite table using Drizzle ORM
export const clipboardSchema = sqliteTable('clipboard', {
  id: integer().primaryKey({ autoIncrement: true }),
  type: text({ enum: ClipboardType }).notNull(), // Ensures only "text" or "file"
  content: text().notNull(), // Stores text or file path
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()) // Stores timestamp
})
