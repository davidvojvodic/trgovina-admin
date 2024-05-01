// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the Billboards component
//    - Fetches billboard data for the specified store from the database using Suspense and SWR
//    - Formats the fetched data for rendering
//    - Renders the BillboardClient component with the formatted data

import useSWR from "swr";
import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-columns";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

interface FormattedBillboard {
  id: string;
  name: string;
  label: string;
  createdAt: string;
  imageUrl: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const Billboards = ({ params }: { params: { storeId: string } }) => {
  const { data, error, isLoading } = useSWR(
    () => `/api/billboards?storeId=${params.storeId}`,
    async () => {
      const response = await prismadb.billboard.findMany({
        where: {
          storeId: params.storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return response.map((item) => ({
        id: item.id,
        name: item.name,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        imageUrl: item.imageUrl,
        isActive: item.isActive,
        startDate: item.startDate
          ? format(item.startDate, "d MMMM yyyy")
          : "",
        endDate: item.endDate ? format(item.endDate, "d MMMM yyyy") : "",
      }));
    }
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the BillboardClient component with the formatted data */}
        <BillboardClient data={data as FormattedBillboard[]} />
      </div>
    </div>
  );
};

export default Billboards;
