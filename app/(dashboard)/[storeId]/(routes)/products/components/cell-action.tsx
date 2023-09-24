"use client";
/**
 * Product Cell Action Component
 *
 * This component renders an action menu for a product in the product list.
 * It provides options to edit the product, copy its ID to the clipboard, and delete it.
 *
 * @param {Object} props - Component props
 * @param {ProductColumn} props.data - The product data
 * @returns {JSX.Element} - The rendered CellAction component
 */

import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { ProductColumn } from "./columns";
import { Button } from "../../../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../../../../../components/ui/dropdown-menu";
import { toast } from "../../../../../../components/ui/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AlertModal from "../../../../../../components/modals/alert-modal";

interface CellActionProps {
  data: ProductColumn; // Product data passed as props
}

export const CellAction = ({ data }: CellActionProps) => {
  // Get the router and params from Next.js
  const router = useRouter();
  const params = useParams();

  // State for loading and modal open state
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Function to copy the product ID to the clipboard
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    // Show a toast notification when the ID is copied
    toast({
      title: "Product ID Copied",
      description: "The product ID has been copied to the clipboard.",
    });
  };

  // Function to handle product deletion
  const onDelete = async () => {
    try {
      setLoading(true);
      // Send a DELETE request to delete the product
      await axios.delete(`/api/${params.storeId}/products/${data.id}`);

      // Refresh the page after deletion
      router.refresh();

      // Show a success toast notification
      toast({
        title: "Product Deleted",
        description: "The product has been successfully deleted.",
        variant: "default",
      });
    } catch (error) {
      // Show an error toast notification if deletion fails
      toast({
        title: "Error",
        description: "Something went wrong while deleting the product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false); // Close the confirmation modal
    }
  };

  // Render the component
  return (
    <>
      {/* Confirmation modal for product deletion */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      {/* Dropdown menu for product actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {/* Dropdown menu content */}
        <DropdownMenuContent align="end">
          {/* Dropdown menu label */}
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* Option to navigate to the product update page */}
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.storeId}/products/${data.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          {/* Option to copy the product ID */}
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          {/* Option to delete the product */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
