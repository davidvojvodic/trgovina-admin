"use client";
import { StoreModal } from "@/components/modals/store-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isInitialMount, setIsInitialMount] = useState(true);

  useEffect(() => {
    setIsInitialMount(false);
  }, []);

  // Only render the modal when the component has finished initializing
  if (isInitialMount) {
    return null;
  }

  return (
    <>
      <StoreModal />
    </>
  );
};
