import { eq } from 'drizzle-orm'
import { db } from '../drizzle/db'
import { notesSchema } from '../drizzle/schema'

// Function to create a new note
export async function createNote(content: object | unknown[]): Promise<
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
    const timestamp = Date.now()
    await db.insert(notesSchema).values({
      description: '',
      title: 'Untitled note',
      content: JSON.stringify(content), // Store JSON as string
      createdAt: timestamp,
      updatedAt: timestamp
    })
    return { result: 'success' }
  } catch (error) {
    console.error(error)

    return { error }
  }
}

// Function to get all notes
export function getAllNotes(): {
  id: number
  title: string
  description: string
  content: unknown
  createdAt: number
  updatedAt: number
}[] {
  return db.select().from(notesSchema).all()
}

// Function to get a single note by ID
export function getNoteById(id: number):
  | {
      id: number
      title: string
      description: string
      content: unknown
      createdAt: number
      updatedAt: number
    }
  | undefined {
  return db.select().from(notesSchema).where(eq(notesSchema.id, id)).get()
}

// Function to update a note
export async function updateNote(
  id: number,
  newContent: object | unknown[]
): Promise<
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
        content: JSON.stringify(newContent),
        updatedAt: Date.now() // Update timestamp
      })
      .where(eq(notesSchema.id, id))
    return { result: 'success' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

// Function to delete a note
export async function deleteNote(id: number): Promise<
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
    await db.delete(notesSchema).where(eq(notesSchema.id, id))
    return { result: 'success' }
  } catch (error) {
    console.error(error)

    return { error }
  }
}
