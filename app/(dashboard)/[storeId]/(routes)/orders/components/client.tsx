"use client";

import Heading from "../../../../../../components/heading";

import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { OrderColumn, columns } from "./columns";
import { DataTable } from "../../../../../../components/data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Naročila (${data.length})`}
        description="Upravljajte oglasne panoje za svojo trgovino"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
