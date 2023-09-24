// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the ColorsPage component
//    - Takes params as a prop, including the storeId
//    - Queries the database to fetch colors for the specified store
//    - Formats the fetched colors for rendering
//    - Renders a page to display a ColorsClient component with color data

// Import necessary modules and components
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ColorColumn } from "./components/columns";
import SizeClient from "./components/client";
import ColorsClient from "./components/client";

// Define the ColorsPage component
const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  // Query the database to fetch colors for the specified store
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the fetched colors into a structured format for rendering
  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format creation date
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the ColorsClient component with formatted color data */}
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
