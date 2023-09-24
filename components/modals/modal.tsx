"use client";

/**
 * @file Modal.tsx
 * @description This file defines a reusable modal component.
 */

// Import necessary modules and components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

/**
 * ModalProps is the prop type for the Modal component.
 */
interface ModalProps {
  title: string; // Title of the modal
  description: string; // Description of the modal
  isOpen: boolean; // Indicates whether the modal is open
  onClose: () => void; // Function to close the modal
  children?: React.ReactNode; // Optional children components
}

/**
 * Modal is a reusable modal component that can display a title, description, and custom content.
 * It can be used to create various types of modals throughout the application.
 */
export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  // Function to handle changes in modal open state
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Render the modal with title, description, and custom content
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          {/* Modal title */}
          <DialogTitle>{title}</DialogTitle>
          {/* Modal description */}
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Custom content within the modal */}
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
