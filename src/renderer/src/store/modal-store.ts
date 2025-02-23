import { create } from 'zustand'

// Define the keys for each modal (you can add more as needed)
export const modalKeys = ['create-note-modal'] as const

// Define the type for modal keys
type ModalKey = (typeof modalKeys)[number]

// Define the interface for the modal store
interface ModalStoreInterface {
  activeModal: ModalKey | null // Tracks which modal is currently open
  openModal: (key: ModalKey) => void // Function to open a modal
  closeModal: () => void // Function to close the active modal
}

// Create the Zustand store
export const modalStore = create<ModalStoreInterface>()((set) => ({
  activeModal: null, // Initially, no modal is open
  // Function to open a modal
  openModal: (key): void => set({ activeModal: key }),
  // Function to close the active modal
  closeModal: (): void => set({ activeModal: null })
}))
