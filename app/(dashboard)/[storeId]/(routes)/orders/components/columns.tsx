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
  paymentStatusImage: {
    paid: string;
    unpaid: string;
  };
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
    accessorKey: "paymentStatusImage", // Column accessor key for payment status image
    header: "Paid", // Column header text
    cell: ({ row }) => (
      <Image
        src={row.original.isPaid ? row.original.paymentStatusImage.paid : row.original.paymentStatusImage.unpaid}
        alt={row.original.isPaid ? "paid" : "unpaid"}
        width={20}
        height={20}
      />
    ),
  },
];
