import { ClipboardDataType, SearchClipboardParams } from 'src/types/database'
import { db } from '../drizzle/db'
import { clipboardSchema } from '../drizzle/schema'
import { and, between, desc, eq, like, sql } from 'drizzle-orm'

// Function to search clipboard entries with pagination
export async function searchClipboard({
  searchTerm,
  fromDate = Date.now() - 24 * 60 * 60 * 1000 * 30, // 30 days before
  toDate = Date.now(),
  limit = 10, // Default limit (page size)
  page = 1 // Default page number
}: SearchClipboardParams): Promise<ClipboardDataType> {
  const offset = (page - 1) * limit // Calculate offset
  const whereCondition = and(
    like(clipboardSchema.content, '%' + searchTerm + '%'),
    between(clipboardSchema.createdAt, fromDate, toDate)
  )

  const results = await db
    .select()
    .from(clipboardSchema)
    .where(whereCondition)
    .orderBy(desc(clipboardSchema.pinned), desc(clipboardSchema.updatedAt)) // Latest first
    .limit(limit)
    .offset(offset)

  // Fetch total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(clipboardSchema)
    .where(whereCondition)

  return {
    results,
    total: count, // Total number of results
    totalPages: Math.ceil(count / limit), // Total pages
    currentPage: page
  }
}

// Function to delete a clipboard entry
export async function deleteClipboardEntry(id: string): Promise<{
  error?: unknown
  result?: string
}> {
  try {
    await db.delete(clipboardSchema).where(eq(clipboardSchema.id, Number(id)))
    return { result: 'success' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

// Function to toggle pin a clipboard entry
export async function togglePinnedClipboardEntry({
  id,
  pinned
}: {
  id: string
  pinned: boolean
}): Promise<{
  result?: string
  error?: unknown
}> {
  try {
    await db
      .update(clipboardSchema)
      .set({
        pinned,
        updatedAt: Date.now() // Update timestamp
      })
      .where(eq(clipboardSchema.id, Number(id)))
    return { result: 'success' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

export async function clearClipboard(): Promise<{
  result?: string
  error?: unknown
}> {
  try {
    await db.delete(clipboardSchema)
    return { result: 'success' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}
