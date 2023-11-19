"use client";
// Import necessary modules and components
import { ColumnDef } from "@tanstack/react-table";

// Define the OrderColumn type
export type EnquiryColumn = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

// Define the columns for the DataTable
export const columns: ColumnDef<EnquiryColumn>[] = [
  {
    accessorKey: "name", // Column accessor key for products
    header: "Name", // Column header text
  },
  {
    accessorKey: "email", // Column accessor key for phone
    header: "Email", // Column header text
  },
  {
    accessorKey: "message", // Column accessor key for address
    header: "Message", // Column header text
  },
];
