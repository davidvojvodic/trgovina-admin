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
    id: "selection",
    accessorKey: "selection",
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
    id: "name",
    accessorKey: "name",
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
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description,
  },
  {
    id: "slug",
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row.original.slug,
  },
  {
    id: "metaDescription",
    accessorKey: "metaDescription",
    header: "Meta Description",
    cell: ({ row }) => row.original.metaDescription,
  },
  {
    id: "parent",
    accessorKey: "parent",
    header: "Parent",
    cell: ({ row }) => row.original.parent,
  },
  {
    id: "children",
    accessorKey: "children",
    header: "Children",
    cell: ({ row }) => row.original.children,
  },
  {
    id: "billboard",
    accessorKey: "billboardName",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardName,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

// Added missing column header names and fixed accessor keys
// to match the actual property names in the CategoryColumn type.
