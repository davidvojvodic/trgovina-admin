import { create } from "zustand";

// Define the interface for the store
interface useStoreModalStore {
  isOpen: boolean; // A boolean to track whether the modal is open or not
  onOpen: () => void; // A function to open the modal
  onClose: () => void; // A function to close the modal
}

// Create and export the Zustand store
export const useStoreModal = create<useStoreModalStore>((set) => ({
  // Step 1: Initialize the store with isOpen set to false, meaning the modal is initially closed.
  isOpen: false,

  // Step 2: Define the onOpen function to set isOpen to true, opening the modal.
  onOpen: () => set({ isOpen: true }),

  // Step 3: Define the onClose function to set isOpen to false, closing the modal.
  onClose: () => set({ isOpen: false }),
}));
