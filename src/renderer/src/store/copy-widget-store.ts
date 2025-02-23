import { create } from 'zustand'

interface PopoverInterface {
  index: number
  isOpen: boolean
}

// Define the interface for the copyWidget store
interface copyWidgetStoreInterface {
  popover: Partial<PopoverInterface>
  searchQuery: string
  setPopover: (values: Partial<PopoverInterface>) => void
  setSearchQuery: (value: string) => void
}

// Create the Zustand store
export const copyWidgetStore = create<copyWidgetStoreInterface>()((set) => ({
  popover: { index: 0, isOpen: false },
  searchQuery: '',
  setPopover(values): void {
    return set({ popover: values })
  },
  setSearchQuery(value): void {
    return set({ searchQuery: value })
  }
}))
