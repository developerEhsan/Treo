import { create } from 'zustand'

interface CopyWidgetState {
  index: number
  opened: 'detailed' | null
}

// Define the interface for the copyWidget store
interface copyWidgetStoreInterface {
  state: Partial<CopyWidgetState>
  searchQuery: string
  setState: (values: Partial<CopyWidgetState>) => void
  setSearchQuery: (value: string) => void
}

// Create the Zustand store
export const copyWidgetStore = create<copyWidgetStoreInterface>()((set) => ({
  state: { index: 0, isOpen: false },
  searchQuery: '',
  setState: (values): void => set({ state: values }),
  setSearchQuery: (value): void => set({ searchQuery: value })
}))
