"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the CategoryColumn type representing category data
// 3. Define an array of columns for displaying category data

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

// Define the type for CategoryColumn representing category data
export type CategoryColumn = {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  metaDescription?: string;
  parent?: string;
  children?: string[];
  billboardName: string;
  createdAt: string;
};

// Define an array of columns for displaying category data
export const categoriesColumns: ColumnDef<CategoryColumn>[] = [
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
    size: 30,
  },
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
    id: "Description",
    accessorKey: "description", // Key for accessing the description property
    header: "Description", // Header text for the "Description" column
    cell: ({ row }) => row.original.description, // Render description
  },
  {
    id: "Slug",
    accessorKey: "slug", // Key for accessing the slug property
    header: "Slug", // Header text for the "Slug" column
    cell: ({ row }) => row.original.slug, // Render slug
  },
  {
    id: "Meta Description",
    accessorKey: "metaDescription", // Key for accessing the metaDescription property
    header: "Meta Description", // Header text for the "Meta Description" column
    cell: ({ row }) => row.original.metaDescription, // Render metaDescription
  },
  {
    id: "Parent",
    accessorKey: "parent", // Key for accessing the parent property
    header: "Parent", // Header text for the "Parent" column
    cell: ({ row }) => row.original.parent, // Render parent
  },
  {
    id: "Children",
    accessorKey: "children", // Key for accessing the children property
    header: "Children", // Header text for the "Children" column
    cell: ({ row }) => row.original.children, // Render children
  },
  {
    id: "Billboard",
    accessorKey: "billboard", // Key for accessing the billboard property
    header: "Billboard", // Header text for the "Billboard" column
    cell: ({ row }) => row.original.billboardName, // Render billboard label
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Header text for the "Actions" column
    cell: ({ row }) => <CellAction data={row.original} />, // Render cell actions using the CellAction component
  },
];
