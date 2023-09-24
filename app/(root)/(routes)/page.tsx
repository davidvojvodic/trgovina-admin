"use client";

/**
 * @file SetupPage.tsx
 * @description This file defines a setup page component.
 */

// Import necessary modules and components
import { Modal } from "@/components/modals/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { UserButton } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * SetupPage is a page component for setting up the application.
 */
const SetupPage = () => {
  // Get the onOpen function and isOpen state from the useStoreModal hook
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  // Automatically open the store modal if it is not already open
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  // This page does not render any content, it only triggers the opening of the store modal
  return null;
};

export default SetupPage;
