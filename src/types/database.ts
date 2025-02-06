export interface ClipboardDataType {
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

export interface SearchClipboardParams {
  searchTerm?: string
  fromDate?: number
  toDate?: number
  limit?: number
  page?: number
}
