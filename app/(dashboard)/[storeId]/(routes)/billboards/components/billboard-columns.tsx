"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardColumn type representing billboard data
// 3. Define an array of columns for displaying billboard data

// Import necessary modules and components

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpWideNarrow,
} from "lucide-react";
import Image from "next/image";

// Define the type for BillboardColumn representing billboard data
export type BillboardColumn = {
  id: string;
  name: string;
  label?: string | null;
  imageUrl?: string | null;
  isActive: boolean | null;
  createdAt: string;
};

// Define an array of columns for displaying billboard data
export const columns: ColumnDef<BillboardColumn>[] = [
  {
    id: "select",
    accessorKey: "select",

    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    size: 20,
  },
  // {
  //   id: "ID",
  //   accessorKey: "id",
  //   enableSorting: true,
  //   enableResizing: true,
  //   enableGlobalFilter: true,
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         className="!p-0"
  //         variant="ghost"
  //         onClick={column.getToggleSortingHandler()}
  //       >
  //         ID
  //         {column.getIsSorted() === false && (
  //           <ArrowUpDown className="h-4 w-4 ml-2" />
  //         )}
  //         {column.getIsSorted() === "asc" && (
  //           <ArrowUpWideNarrow className="h-4 w-4 ml-2" />
  //         )}
  //         {column.getIsSorted() === "desc" && (
  //           <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
  //         )}
  //       </Button>
  //     );
  //   },
  // },
  {
    id: "Name",
    accessorKey: "name", // Key for accessing the name property
    enableSorting: true,
    enableResizing: true,
    header: ({ column }) => {
      return (
        <Button
          className="!p-0 rounded-none"
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
        >
          Name
          {column.getIsSorted() === false && (
            <ArrowUpDown className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "asc" && (
            <ArrowUpWideNarrow className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
          )}
        </Button>
      );
    },
  },
  {
    id: "Label",
    accessorKey: "label", // Key for accessing the label property
    enableSorting: true,
    enableResizing: true,
    header: ({ column }) => {
      return (
        <Button
          className="!p-0 rounded-none"
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
        >
          Label
          {column.getIsSorted() === false && (
            <ArrowUpDown className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "asc" && (
            <ArrowUpWideNarrow className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
          )}
        </Button>
      );
    },
  },
  {
    id: "isActive",
    header: "Active",
    accessorKey: "isActive", // Key for accessing the imageUrl property
    enableSorting: false,
    enableResizing: true,
    enableColumnFilter: false,
    cell: ({ row }) => <>{row.getValue<boolean>("isActive") ? <Image src={"/checked.png"} alt="check" width={20} height={20} /> : <Image src={"/unchecked.png"} alt="check" width={20} height={20} />}</>,
  },
  {
    id: "imageUrl",
    header: "Image",
    accessorKey: "imageUrl", // Key for accessing the imageUrl property
    enableSorting: false,
    enableResizing: true,
    enableColumnFilter: false,
    cell: ({ row }) => (
      <div>
        <Image src={row.getValue<string>("imageUrl")} alt="image" width={65} height={65} />
      </div>
    ),
      
  },
  {
    id: "startDate",
    accessorKey: "startDate", // Key for accessing the createdAt property
    enableSorting: true,
    enableResizing: true,
    header: ({ column }) => {
      return (
        <Button
          className="!p-0 rounded-none"
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
        >
          Start date
          {column.getIsSorted() === false && (
            <ArrowUpDown className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "asc" && (
            <ArrowUpWideNarrow className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
          )}
        </Button>
      );
    },
  },
  {
    id: "endDate",
    accessorKey: "endDate", // Key for accessing the createdAt property
    header: ({ column }) => {
      return (
        <Button
          className="!p-0 rounded-none"
          variant="ghost"
          onClick={column.getToggleSortingHandler()}
        >
          End date
          {column.getIsSorted() === false && (
            <ArrowUpDown className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "asc" && (
            <ArrowUpWideNarrow className="h-4 w-4 ml-2" />
          )}
          {column.getIsSorted() === "desc" && (
            <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
          )}
        </Button>
      );
    }
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Header text for the actions column
    cell: ({ row }) => <CellAction data={row.original} />, // Render cell actions using the CellAction component
  },
];
