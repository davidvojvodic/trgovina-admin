"use client";
// Import necessary components and hooks from external libraries and components
import { StoreModal } from "@/components/modals/store-modal"; // Import StoreModal component from a relative path
import { useEffect, useState } from "react"; // Import useEffect and useState hooks from React library

// Define a component called `ModalProvider`
export const ModalProvider = () => {
  // Step 1: Define a state variable `isMounted` and initialize it to `false`
  const [isMounted, setIsMounted] = useState(false);

  // Step 2: Use the `useEffect` hook to set `isMounted` to `true` when the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Step 3: Check if the component is not yet mounted, and if so, return `null` (don't render anything)
  if (!isMounted) {
    return null;
  }

  // Step 4: Render the `StoreModal` component inside a fragment
  return (
    <>
      <StoreModal />
    </>
  );
};
