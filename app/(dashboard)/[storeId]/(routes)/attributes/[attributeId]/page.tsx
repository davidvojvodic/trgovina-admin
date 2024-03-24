import AttributeForm from "@/components/attribute-form";
import prismadb from "@/lib/prismadb";
import React from "react";

const AttributePage = async ({
  params,
}: {
  params: { attributeId: string };
}) => {
  const attribute = await prismadb.attribute.findUnique({
    where: {
      id: params.attributeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AttributeForm initialData={attribute} />
      </div>
    </div>
  );
};

export default AttributePage;
