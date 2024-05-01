import { create } from "zustand";

// Define the interface for the store
interface UseStoreModalStore {
  isModalOpen: boolean; // A boolean to track whether the modal is open or not
  openModal: () => void; // A function to open the modal
  closeModal: () => void; // A function to close the modal
}

// Create and export the Zustand store
export const useStoreModal = create<UseStoreModalStore>((set) => ({
  // Step 1: Initialize the store with isModalOpen set to false, meaning the modal is initially closed.
  isModalOpen: false,

  // Step 2: Define the openModal function to set isModalOpen to true, opening the modal.
  openModal: () => set({ isModalOpen: true }),

  // Step 3: Define the closeModal function to set isModalOpen to false, closing the modal.
  closeModal: () => set({ isModalOpen: false }),
}));
