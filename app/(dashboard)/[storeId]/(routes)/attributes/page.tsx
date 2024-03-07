import prismadb from "@/lib/prismadb";
import React from "react";
import { AttributeColumn } from "./components/attribute-columns";
import { format } from "date-fns";
import AttributeClient from "./components/attribute-client";

const AttributesPage = async ({ params }: { params: { storeId: string } }) => {
  const attributes = await prismadb.attribute.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formattedAttributes: AttributeColumn[] = attributes.map((item) => ({
    id: item.id,
    key: item.key,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AttributeClient data={formattedAttributes} />
      </div>
    </div>
  );
};

export default AttributesPage;
