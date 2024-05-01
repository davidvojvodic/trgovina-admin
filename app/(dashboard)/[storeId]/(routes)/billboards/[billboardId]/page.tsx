// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardPage component
//    - Takes params as a prop, including the billboardId
//    - Fetches a specific billboard by ID using SWR
//    - Renders a page to display a BillboardForm with initial data
//    - Handles errors and fallback UI

// Import necessary modules and components
import useSWR from "swr";
import BillboardForm from "@/components/billboard-form";
import prismadb from "@/lib/prismadb";

// Define the BillboardPage component
const BillboardPage = ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // Fetch a specific billboard by ID using SWR
  const { data: billboard, error, isLoading } = useSWR(
    `/api/billboards/${params.billboardId}`,
    async () => {
      return await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId,
        },
      });
    }
  );

  // Handle errors and fallback UI
  if (error) return <div>Error loading billboard...</div>;
  if (isLoading) return <div>Loading billboard...</div>;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the BillboardForm component with initial data */}
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
