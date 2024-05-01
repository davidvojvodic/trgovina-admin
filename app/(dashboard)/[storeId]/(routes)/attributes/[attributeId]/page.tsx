import AttributeForm from "@/components/attribute-form";
import prismadb from "@/lib/prismadb";
import { notFound } from "next/navigation";
import React from "react";

interface AttributePageProps {
  params: {
    attributeId: string;
  };
}

const AttributePage: React.FC<AttributePageProps> = async ({
  params,
}) => {
  const attribute = await prismadb.attribute.findUnique({
    where: {
      id: params.attributeId,
    },
  });

  if (!attribute) {
    notFound();
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AttributeForm initialData={attribute} />
      </div>
    </div>
  );
};

export default AttributePage;
