import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'

// Define ClipboardType as a tuple (optimized for Drizzle & TypeScript)
export const ClipboardType = ['text', 'file'] as const
export type ClipboardTypeType = (typeof ClipboardType)[number] // "text" | "file"

const createdAt = integer()
  .notNull()
  .$defaultFn(() => Date.now()) // Stores timestamp
const updatedAt = integer()
  .notNull()
  .$onUpdateFn(() => Date.now())
// Define SQLite table using Drizzle ORM
export const clipboardSchema = sqliteTable('clipboard', {
  id: integer().primaryKey({ autoIncrement: true }),
  pinned: integer({ mode: 'boolean' }).notNull().default(false),
  type: text({ enum: ClipboardType }).notNull(), // Ensures only "text" or "file"
  content: text().notNull(), // Stores text or file path
  createdAt,
  updatedAt
})

export const notesSchema = sqliteTable('notes', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text().notNull(),
  favorite: integer({ mode: 'boolean' }).notNull().default(false),
  content: blob().notNull(), // content is going to be JSON
  labels: blob(), // content is going to be JSON
  createdAt, // Stores timestamp
  updatedAt
})
