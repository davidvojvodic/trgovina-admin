"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the CellAction component
//    - Takes data as a prop, representing color column data
//    - Renders a dropdown menu with actions for each color

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
import { ColorColumn } from "./columns";

// Define the props interface for the CellAction component
interface CellActionProps {
  data: ColorColumn;
}

// Define the CellAction component
export const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Function to copy the color ID to the clipboard
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "Kopirano",
      description: "ID barve kopiran v odložišče.",
    });
  };

  // Function to delete a color
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${data.id}`);

      router.refresh();

      toast({
        title: "Uspešno",
        description: "Barva izbrisana",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Prepričajte se, da ste najprej odstranili vse izdelke, ki uporabljajo to barvo.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      {/* Render an alert modal for confirming the delete action */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      {/* Render a dropdown menu with actions for the color */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Odpri menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Dejanja</DropdownMenuLabel>
          {/* Option to update the color */}
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/colors/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          {/* Option to copy the color ID */}
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Kopiraj ID
          </DropdownMenuItem>
          {/* Option to delete the color */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Izbriši
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
