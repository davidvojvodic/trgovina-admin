"use client";
import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";

// Define the SizeColumn type for columns
type SizeColumn = {
  id: string;
  name: string;
  value: number;
};

// Define the columns
const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

// Props for the SizeClient component
interface SizeClientProps {
  data: SizeColumn[]; // An array of size data to display.
}

// SizeClient component
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
        <Button
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
          className="ml-auto"
        >
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      {/* Render a data table with size data */}
      <DataTable columns={columns} data={data} />
      {/* Display a section heading for API calls */}
      <Heading title="API" description="API calls for sizes" />
      <Separator />
      {/* Include an API list for sizes */}
      <ApiList entityName="sizes" entityIdName="id" />
    </>
  );
};

export default SizeClient;
