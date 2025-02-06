import { ElectronAPI } from '@electron-toolkit/preload'

interface ClipboardDataType {
  results: {
    id: number
    type: 'text' | 'file'
    content: string
    createdAt: number
  }[]
  total: number
  totalPages: number
  currentPage: number
}

interface SearchClipboardParams {
  searchTerm?: string
  fromDate?: number
  toDate?: number
  limit?: number
  page?: number
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveText: (text: string) => Promise<void>
      fetchTexts: () => Promise<ClipboardDataType>
      saveFile: (filePath: string) => Promise<void>
      closeWindow: () => Promise<void>
      pasteCopied: () => Promise<void>
      handleWindow: (e?: boolean) => Promise<boolean>
      search: (searchValues: SearchClipboardParams) => Promise<ClipboardDataType>
    }
  }
}
