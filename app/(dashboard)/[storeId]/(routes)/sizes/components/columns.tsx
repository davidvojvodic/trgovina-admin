"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

/**
 * Type definition for a SizeColumn representing the properties of a size.
 */
export type SizeColumn = {
  id: string; // The unique identifier for the size.
  name: string; // The name of the size.
  value: string; // The value of the size.
  createdAt: Date; // The date when the size was created, as a JavaScript Date object.
};

/**
 * An array of column definitions for displaying size data in a table.
 */
export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name", // Define the accessor key for the name property.
    header: "Name", // Set the column header text to "Name".
  },
  {
    accessorKey: "value", // Define the accessor key for the value property.
    header: "Value", // Set the column header text to "Value".
  },
  {
    accessorKey: "createdAt", // Define the accessor key for the createdAt property.
    header: "Date", // Set the column header text to "Date".
    cell: ({ getValue }) => new Intl.DateTimeFormat("en-US", { dateStyle: "short" }).format(getValue() as Date), // Format the date using the Intl object.
  },
  {
    id: "actions", // Define a unique identifier for the actions column.
    header: "Actions", // Set the column header text to "Actions".
    cell: ({ row }) => <CellAction data={row.original} />, // Render actions using the CellAction component.
  },
];

