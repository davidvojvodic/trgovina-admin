"use client";

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";
import { SizeColumn } from "./columns";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient = ({ data }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Velikosti (${data.length})`}
          description="Upravljajte velikosti za svojo trgovino"
        />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Dodaj nov
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API calls for sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
