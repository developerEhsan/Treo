export interface ClipboardDataItem {
  id: number
  type: 'text' | 'file'
  content: string
  createdAt: number
  currentPage: number
}
export interface ClipboardDataType {
  results: ClipboardDataItem[]
  total: number
  totalPages: number
  currentPage: number
}
