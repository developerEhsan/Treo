import { Content } from '@tiptap/react'
export interface NoteInterface {
  id: number
  title: string
  description: string
  content: Content // Can be an object or array
  createdAt: number
  updatedAt: number
}
