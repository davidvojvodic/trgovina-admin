// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardPage component
//    - Takes params as a prop, including the billboardId
//    - Queries the database to fetch a specific billboard by ID
//    - Renders a page to display a BillboardForm with initial data

// Import necessary modules and components
import BillboardForm from "@/components/billboard-form";
import prismadb from "@/lib/prismadb";

// Define the BillboardPage component
const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  // Query the database to fetch a specific billboard by its ID
  const billboard = await prismadb.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

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
