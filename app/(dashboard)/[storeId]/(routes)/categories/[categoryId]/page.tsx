// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardPage component
//    - Takes params as a prop, including the categoryId and storeId
//    - Queries the database to fetch a specific category by ID
//    - Queries the database to fetch all billboards for the specified store
//    - Renders a page to display a CategoryForm with initial data

// Import necessary modules and components
import CategoryForm from "@/components/category-form";
import prismadb from "@/lib/prismadb";

// Define the BillboardPage component
const BillboardPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  // Query the database to fetch a specific category by its ID
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  // Query the database to fetch all billboards for the specified store
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the CategoryForm component with billboards and initial category data */}
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default BillboardPage;
