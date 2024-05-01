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
  data: ProductColumn[]; // Product data passed as props
}

const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  const addProductHandler = () => {
    router.push(`/${params.storeId}/products/new`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={addProductHandler}>
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
      <Separator />
      <Heading title="API" description="API calls for products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
