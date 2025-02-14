import { eq } from 'drizzle-orm'
import { db } from '../drizzle/db'
import { notesSchema } from '../drizzle/schema'

// Function to create a new note
export function createNote(params: {
  content: object | unknown[]
  title: string
  description: string
  labels: string[]
}):
  | {
      id: number
      content: unknown
      createdAt: number
      title: string
      description: string
      labels: unknown
      updatedAt: number
    }
  | { error: unknown } {
  try {
    const timestamp = Date.now()
    const createdNote = db
      .insert(notesSchema)
      .values({
        ...params,
        labels: JSON.stringify(params.labels),
        content: JSON.stringify(params.content), // Store JSON as string
        createdAt: timestamp,
        updatedAt: timestamp
      })
      .returning()
      .get()
    return createdNote
  } catch (error) {
    console.error(error)

    return { error }
  }
}

// Function to get all notes (excluding the `content` field)
export function getAllNotes(): {
  id: number
  title: string
  description: string
  createdAt: number
  updatedAt: number
}[] {
  // Explicitly select only the required fields
  const allNotes = db
    .select({
      id: notesSchema.id,
      title: notesSchema.title,
      description: notesSchema.description,
      createdAt: notesSchema.createdAt,
      updatedAt: notesSchema.updatedAt
    })
    .from(notesSchema)
    .all()

  return allNotes
}

// Function to get a single note by ID
export function getNoteById(id: string):
  | {
      id: number
      title: string
      description: string
      content: unknown
      createdAt: number
      updatedAt: number
    }
  | undefined {
  const result = db
    .select()
    .from(notesSchema)
    .where(eq(notesSchema.id, Number(id)))
    .get()
  console.log(result)

  return result && { ...result, content: JSON.parse(result?.content as string) }
}

// Function to update a note
export async function updateNote({
  id,
  content,
  description,
  title
}: {
  id: string
  content: object | unknown[]
  title?: string
  description?: string
}): Promise<
  | {
      result: string
      error?: undefined
    }
  | {
      error: unknown
      result?: undefined
    }
> {
  try {
    await db
      .update(notesSchema)
      .set({
        content: JSON.stringify(content),
        title,
        description,
        updatedAt: Date.now() // Update timestamp
      })
      .where(eq(notesSchema.id, Number(id)))
    return { result: 'success' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

// Function to delete a note
export async function deleteNote(id: string): Promise<
  | {
      result: string
      error?: undefined
    }
  | {
      error: unknown
      result?: undefined
    }
> {
  try {
    await db.delete(notesSchema).where(eq(notesSchema.id, Number(id)))
    return { result: 'success' }
  } catch (error) {
    console.error(error)

    return { error }
  }
}
