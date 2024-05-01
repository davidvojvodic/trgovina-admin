"use client"; // Notable import statement

// Import necessary modules and components
import { Plus } from "lucide-react";
import Heading from "../../../../components/heading";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../../components/data-table";
import { ApiList } from "../../../../components/api-list";

// Define the ColorColumn type
type ColorColumn = {
  colorId: string;
  name: string;
  value: string;
  version: string;
};

// Define the columns for the DataTable
const columns: ColumnDef<ColorColumn>[] = [
  // Add your column definitions here
];

// Define the ColorsClient component
const ColorsClient = ({ data }: { data: ColorColumn[] }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Render a heading with the count of colors */}
        <Heading title={`Colors (${data.length})`} description="Manage colors for your store" />
        {/* Render a button to add a new color */}
        <Button
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
          className="ml-auto"
        >
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      {/* Render a data table to display colors */}
      <DataTable columns={columns} data={data} />
      {/* Render a heading for API information */}
      <Heading title="API" description="API calls for colors" />
      <Separator />
      {/* Render an API list */}
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorsClient;

