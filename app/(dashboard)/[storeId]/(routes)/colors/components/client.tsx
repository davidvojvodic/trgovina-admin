"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the ColorsClient component
//    - Takes data as a prop, representing color column data
//    - Renders a page for managing colors with data table and actions

// Import necessary modules and components

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";
import { ColorColumn } from "./columns";

// Define the props interface for the ColorsClient component
interface ColorsClientProps {
  data: ColorColumn[];
}

// Define the ColorsClient component
const ColorsClient = ({ data }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        {/* Render a heading with the count of colors */}
        <Heading
          title={`Barve (${data.length})`}
          description="Upravljajte barve za svojo trgovino"
        />
        {/* Render a button to add a new color */}
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Dodaj nov
        </Button>
      </div>
      <Separator />
      {/* Render a data table to display colors */}
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* Render a heading for API information */}
      <Heading title="API" description="API calls for colors" />
      <Separator />
      {/* Render an API list */}
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorsClient;
