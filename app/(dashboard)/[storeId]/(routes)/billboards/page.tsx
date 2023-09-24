// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the Billboards component
//    - Takes params as a prop, which includes the storeId
//    - Fetches billboard data for the specified store from the database
//    - Formats the fetched data for rendering
//    - Renders the BillboardClient component with the formatted data

// Import necessary modules and components
import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-columns";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

// Define the Billboards component
const Billboards = async ({ params }: { params: { storeId: string } }) => {
  // Query the database to fetch a list of billboards for the specified store
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the fetched billboards into a structured format for rendering
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format creation date
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the BillboardClient component with the formatted data */}
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
