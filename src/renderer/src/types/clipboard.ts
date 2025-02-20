export interface ClipboardDataItem {
  id: number
  type: 'text' | 'file'
  content: string
  createdAt: number
}
