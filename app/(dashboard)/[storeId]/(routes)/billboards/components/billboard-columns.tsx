"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardColumn type representing billboard data
// 3. Define an array of columns for displaying billboard data

// Import necessary modules and components

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// Define the type for BillboardColumn representing billboard data
export type BillboardColumn = {
  id: string;
  label: string;
  createdAt: string;
};

// Define an array of columns for displaying billboard data
export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label", // Key for accessing the label property
    header: "Label", // Header text for the "Oznaka" column
  },
  {
    accessorKey: "createdAt", // Key for accessing the createdAt property
    header: "Date", // Header text for the "Datum" column
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Header text for the actions column
    cell: ({ row }) => <CellAction data={row.original} />, // Render cell actions using the CellAction component
  },
];
