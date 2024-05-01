import prismadb from "@/lib/prismadb";
import React, { useEffect, useState } from "react";
import { AttributeColumn } from "./components/attribute-columns";
import { format } from "date-fns";
import AttributeClient from "./components/attribute-client";

const AttributesPage = ({ params }: { params: { storeId: string } }) => {
  const [attributes, setAttributes] = useState<AttributeColumn[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      const data = await prismadb.attribute.findMany({
        where: {
          storeId: params.storeId,
        },
      });

      const formattedAttributes: AttributeColumn[] = data.map((item) => ({
        id: item.id,
        key: item.key,
        value: item.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      }));

      setAttributes(formattedAttributes);
    };

    fetchAttributes();
  }, [params.storeId]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AttributeClient data={attributes} />
      </div>
    </div>
  );
};

export default AttributesPage;
