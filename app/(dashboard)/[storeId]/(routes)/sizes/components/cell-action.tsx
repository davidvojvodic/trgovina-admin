"use client";
/**
 * @file CellAction.tsx
 * @description This component represents the actions that can be performed on a size item in a table.
 * It provides options to edit, copy the ID, and delete a size item.
 *
 * Functionality:
 * 1. Define the CellAction component that displays actions for a size item.
 * 2. Use Lucide React icons for edit, copy, and delete actions.
 * 3. Handle copy action by copying the size ID to the clipboard.
 * 4. Handle delete action by sending a request to delete the size item.
 * 5. Display a confirmation modal before deleting the size item.
 */

// Import necessary modules and components
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
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
import { SizeColumn } from "./columns";

/**
 * Props for the CellAction component.
 */
interface CellActionProps {
  data: SizeColumn; // The size item data to perform actions on.
}

/**
 * CellAction component
 * @param {CellActionProps} props - The component's props.
 */
export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  /**
   * Handles the copy action by copying the size ID to the clipboard.
   * @param {string} id - The ID to be copied.
   */
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Success",
      description: "Size ID copied to clipboard.",
    });
  };

  /**
   * Handles the delete action by sending a request to delete the size item.
   */
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);

      router.refresh();

      toast({
        title: "Success",
        description: "The size has been deleted.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Make sure you remove all products that use this size first.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
