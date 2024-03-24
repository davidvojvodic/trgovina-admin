// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the CategoriesPage component
//    - Takes params as a prop, including the storeId
//    - Queries the database to fetch categories for the specified store
//    - Includes billboard information in the query
//    - Formats the fetched categories for rendering
//    - Renders a page to display a CategoryClient component with category data

// Import necessary modules and components
import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client";
import CategoryClient from "@/app/(dashboard)/[storeId]/(routes)/categories/components/category-client";
import { CategoryColumn } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/category-colums";
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";

// Define the CategoriesPage component
const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  // Query the database to fetch categories for the specified store, including billboard information
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
      parent: true,
      children: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the fetched categories into a structured format for rendering
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description || "",
    slug: item.slug || "",
    metaDescription: item.metaDescription || "",
    parent: item.parent?.name || "",
    children: item.children?.map((child) => child.name) || [],
    billboardName: item.billboard?.name || "", // Provide an empty string as default value when billboardLabel is null
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format creation date
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the CategoryClient component with formatted category data */}
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
