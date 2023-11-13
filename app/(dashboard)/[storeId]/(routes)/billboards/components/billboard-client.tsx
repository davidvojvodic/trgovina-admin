"use client";
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardClient component
//    - Takes data as a prop, representing billboard column data
//    - Renders a page for managing billboards
//    - Displays a heading with the count of billboards and a description
//    - Provides a button to add a new billboard
//    - Renders a DataTable to display billboard data
//    - Displays a heading for API calls related to billboards
//    - Renders an APIList component for billboard API calls

// Import necessary modules and components

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { BillboardColumn, columns } from "./billboard-columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";

// Define the props interface for the BillboardClient component
interface BillboardClientProps {
  data: BillboardColumn[];
}

// Define the BillboardClient component
const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      {/* Render a section with heading, description, and a button to add a new billboard */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data.length})`} // Display the count of billboards
          description="Manage billboards for your store" // Description
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)} // Navigate to add new billboard page
        >
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator /> {/* Render a separator */}
      <DataTable searchKey="label" columns={columns} data={data} />{" "}
      {/* Render DataTable to display billboard data */}
      <Heading title="API" description="API calls for billboards" />{" "}
      {/* API heading */}
      <Separator /> {/* Render a separator */}
      <ApiList entityName="billboards" entityIdName="billboardId" />{" "}
      {/* Render an APIList component */}
    </>
  );
};

export default BillboardClient;
