"use client";
// Import necessary modules and components
import Heading from "../../../../../../components/heading";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

// Import column definitions for the DataTable
import { OrderColumn, columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";

// Define the OrderClientProps interface
interface OrderClientProps {
  data: OrderColumn[];
}

// Define the OrderClient component
const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      {/* Display a heading with the number of orders */}
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      {/* Display a separator */}
      <Separator />
      {/* Render a DataTable to display order data */}
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient; // Export the OrderClient component
