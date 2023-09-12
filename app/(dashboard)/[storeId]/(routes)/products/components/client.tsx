"use client";

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { ProductColumn, columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Izdelki (${data.length})`}
          description="Upravljajte izdelke za svojo trgovino"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Dodaj nov
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
