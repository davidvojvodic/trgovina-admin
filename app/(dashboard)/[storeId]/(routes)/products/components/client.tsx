"use client";
/**
 * Product Client Component
 *
 * This component displays a list of products with options to add a new product.
 * It also provides an API list for products.
 *
 * @param {Object} props - Component props
 * @param {ProductColumn[]} props.data - The product data to display
 * @returns {JSX.Element} - The rendered ProductClient component
 */
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

  return (
    <>
      {/* Display heading with the total number of products */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        {/* Button to navigate to the page for adding a new product */}
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      {/* Display a data table for products */}
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* Display a heading for the API section */}
      <Heading title="API" description="API calls for products" />
      <Separator />
      {/* Display an API list for products */}
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
