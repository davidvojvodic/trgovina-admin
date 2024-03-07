"use client";

import React from "react";
import { AttributeColumn, attributeColumns } from "./attribute-columns";
import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";

interface AttributeClientProps {
  data: AttributeColumn[];
}
const AttributeClient = ({ data }: AttributeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Attributes (${data.length})`}
          description="Manage attributes for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/attributes/new`)}
        >
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator />
      <DataTable columns={attributeColumns} data={data} />
    </>
  );
};

export default AttributeClient;
