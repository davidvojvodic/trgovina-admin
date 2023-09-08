"use client";

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";
import { ColorColumn } from "./columns";

interface ColorsClientProps {
  data: ColorColumn[];
}

const ColorsClient = ({ data }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Barve (${data.length})`}
          description="Upravljajte barve za svojo trgovino"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Dodaj nov
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorsClient;
