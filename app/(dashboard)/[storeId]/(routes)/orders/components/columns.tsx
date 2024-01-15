"use client";
// Import necessary modules and components
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// Define the OrderColumn type
export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

// Define the columns for the DataTable
export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products", // Column accessor key for products
    header: "Products", // Column header text
  },
  {
    accessorKey: "phone", // Column accessor key for phone
    header: "Phone", // Column header text
  },
  {
    accessorKey: "address", // Column accessor key for address
    header: "Address", // Column header text
  },
  {
    accessorKey: "totalPrice", // Column accessor key for total price
    header: "Total price", // Column header text
  },
  {
    accessorKey: "isPaid", // Column accessor key for isPaid
    header: "Paid", // Column header text
    cell: ({ row }) => (row.original.isPaid ? <Image src="/checked.png" alt="check" width={20} height={20} /> : <Image src="/unchecked.png" alt="check" width={20} height={20} />),
  },
];
