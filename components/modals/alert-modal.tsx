"use client";

/**
 * @file AlertModal.tsx
 * @description This file defines an alert modal component.
 */

// Import necessary modules and components
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import { Button } from "../ui/button";

/**
 * AlertModalProps is the prop type for the AlertModal component.
 */
interface AlertModalProps {
  isOpen: boolean; // Indicates whether the modal is open
  onClose: () => void; // Function to close the modal
  onConfirm: () => void; // Function to confirm the action (e.g., delete)
  loading: boolean; // Indicates whether an operation is in progress (e.g., loading)
}

/**
 * AlertModal is a modal component used to display an alert or confirmation dialog.
 * It allows users to confirm or cancel an action.
 */
const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  // State to track whether the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // UseEffect to set the isMounted state to true when the component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If the component is not mounted, return null (do not render anything)
  if (!isMounted) {
    return null;
  }

  // Render the alert modal with title, description, cancel button, and confirm button
  return (
    <Modal
      title="Are you sure?" // Title of the alert modal
      description="This action cannot be undone." // Description of the alert modal
      isOpen={isOpen} // Whether the modal is open or not
      onClose={onClose} // Function to close the modal when canceled
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        {/* Cancel button */}
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        {/* Confirm button */}
        <Button variant="destructive" disabled={loading} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
