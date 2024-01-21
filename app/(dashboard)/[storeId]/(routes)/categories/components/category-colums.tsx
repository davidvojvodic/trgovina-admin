"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the CategoryColumn type representing category data
// 3. Define an array of columns for displaying category data

// Import necessary modules and components

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

// Define the type for CategoryColumn representing category data
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

// Define an array of columns for displaying category data
export const categoriesColumns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name", // Key for accessing the name property
    header: "Name", // Header text for the "Name" column
  },
  {
    accessorKey: "billboard", // Key for accessing the billboard property
    header: "Billboard", // Header text for the "Billboard" column
    cell: ({ row }) => row.original.billboardLabel, // Render billboard label
  },
  {
    accessorKey: "createdAt", // Key for accessing the createdAt property
    header: "Date", // Header text for the "Date" column
  },
  {
    id: "actions", // Unique ID for the actions column
    header: "Actions", // Header text for the "Actions" column
    cell: ({ row }) => <CellAction data={row.original} />, // Render cell actions using the CellAction component
  },
];
