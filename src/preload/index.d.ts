import { ElectronAPI } from '@electron-toolkit/preload'
import { Content } from '@tiptap/react'

// Define the structure of a clipboard data item
interface ClipboardDataItem {
  id: number
  type: 'text' | 'file'
  content: string
  createdAt: number
}

// Define the structure of the clipboard data response
interface ClipboardDataType {
  results: ClipboardDataItem[]
  total: number
  totalPages: number
  currentPage: number
}

// Define the parameters for searching clipboard data
interface SearchClipboardParams {
  searchTerm?: string
  fromDate?: number
  toDate?: number
  limit?: number
  page?: number
}

// Define the structure of a note
interface Note {
  id: number
  title: string
  description: string
  favorite: boolean
  content: Content // Can be an object or array
  createdAt: number
  updatedAt: number
}

// Define the response structure for create/update operations
interface MutationResponse extends Note {
  error?: unknown
}

// Define the API methods exposed to the renderer process
interface RendererAPI {
  saveText: (text: string) => Promise<void>
  fetchTexts: () => Promise<ClipboardDataType>
  saveFile: (filePath: string) => Promise<void>
  closeWindow: () => Promise<void>
  pasteCopied: () => Promise<void>
  handleWindow: (e?: boolean) => Promise<boolean>
  search: (searchValues: SearchClipboardParams) => Promise<ClipboardDataType>
  createNote: (values: {
    content: object | unknown[]
    title: string
    description: string
    labels?: string[]
  }) => Promise<MutationResponse>
  updateNote: (values: {
    id: string
    content: string | JSONContent | JSONContent[] | null
    title?: string | null
    description?: string | null
  }) => Promise<MutationResponse>
  deleteNote: (id: string) => Promise<void>
  getNote: (id: string) => Promise<Note>
  getAllNotes: () => Promise<Note[]>
  toggleFavoriteNote: (values: { id: string; favorite: boolean }) => Promise<{
    result?: string
    error?: unknown
  }>
  togglePinnedClipboardEntry: (values: { id: string; pinned: boolean }) => Promise<{
    result?: string
    error?: unknown
  }>
  deleteClipboardEntry: (id: string) => Promise<{
    result?: string
    error?: unknown
  }>
}

// Extend the global Window interface to include the Electron API and custom API
declare global {
  interface Window {
    electron: ElectronAPI // Electron's preload API
    api: RendererAPI // Custom API for clipboard and note operations
  }
}
