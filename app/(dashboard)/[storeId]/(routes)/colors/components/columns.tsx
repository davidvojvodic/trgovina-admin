"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the ColorColumn type to represent color data
// 3. Define the columns configuration for displaying color data in a table

// Import necessary modules and components

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// Define the ColorColumn type to represent color data
export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

// Define the columns configuration for displaying color data in a table
export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: "name",
    header: "Ime", // Column header for color names
  },
  {
    accessorKey: "value",
    header: "Vrednost", // Column header for color values
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Datum", // Column header for creation dates
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />, // Cell action for color management
  },
];
