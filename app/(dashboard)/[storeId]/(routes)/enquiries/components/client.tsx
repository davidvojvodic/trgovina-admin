import { DataTable } from "@/components/data-table";
import Heading from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { EnquiryColumn, columns } from "./columns";

interface EnquiryClientProps {
  data: EnquiryColumn[];
}

const EnquiryClient = ({ data }: EnquiryClientProps) => {
  return (
    <>
      {/* Display a heading with the number of orders */}
      <Heading
        title={`Enquiries (0)`}
        description="Manage enquiries for your store"
      />
      {/* Display a separator */}
      <Separator />
      {/* Render a DataTable to display order data */}
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default EnquiryClient;
