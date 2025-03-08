export interface ClipboardDataItem {
  id: number
  type: 'text' | 'file'
  content: string
  createdAt: number
  currentPage: number
  pinned: boolean
}
export interface ClipboardDataType {
  results: ClipboardDataItem[]
  total: number
  totalPages: number
  currentPage: number
}
