"use client";
/**
 * @file SizeColumns.tsx
 * @description This file defines the columns and column definitions for displaying sizes in a table.
 */

// Import necessary modules and components
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

/**
 * Type definition for a SizeColumn representing the properties of a size.
 */
export type SizeColumn = {
  id: string; // The unique identifier for the size.
  name: string; // The name of the size.
  value: string; // The value of the size.
  createdAt: string; // The date when the size was created.
};

/**
 * An array of column definitions for displaying size data in a table.
 */
export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name", // Define the accessor key for the name property.
    header: "Ime", // Set the column header text to "Ime".
  },
  {
    accessorKey: "value", // Define the accessor key for the value property.
    header: "Vrednost", // Set the column header text to "Value".
  },
  {
    accessorKey: "createdAt", // Define the accessor key for the createdAt property.
    header: "Datum", // Set the column header text to "Date".
  },
  {
    id: "actions", // Define a unique identifier for the actions column.
    cell: ({ row }) => <CellAction data={row.original} />, // Render actions using the CellAction component.
  },
];
