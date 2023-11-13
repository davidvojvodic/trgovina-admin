"use client";
/**
 * @file SizeClient.tsx
 * @description This component represents the client interface for managing sizes.
 * It displays a table of sizes, provides options to add a new size, and lists API calls for sizes.
 *
 * Functionality:
 * 1. Define the SizeClient component that displays a list of sizes.
 * 2. Display the total count of sizes and provide an option to add a new size.
 * 3. Render a table with size data and allow sorting by name.
 * 4. Include an API list for sizes.
 */

// Import necessary modules and components
import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";
import { SizeColumn } from "./columns";

/**
 * Props for the SizeClient component.
 */
interface SizeClientProps {
  data: SizeColumn[]; // An array of size data to display.
}

/**
 * SizeClient component
 * @param {SizeClientProps} props - The component's props.
 */
const SizeClient = ({ data }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Display the title and description for the size client */}
        <Heading
          title={`Sizes (${data.length})`}
          description="Manage sizes for your store"
        />
        {/* Render a button to add a new size */}
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      {/* Render a data table with size data */}
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* Display a section heading for API calls */}
      <Heading title="API" description="API calls for sizes" />
      <Separator />
      {/* Include an API list for sizes */}
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
