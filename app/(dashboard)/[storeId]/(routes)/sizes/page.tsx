/**
 * @file SizesPage.tsx
 * @description This component is responsible for displaying a list of sizes and their details.
 * It fetches size data from a database using Prismadb and displays it in a table format.
 *
 * Functionality:
 * 1. Fetch size data based on the provided storeId.
 * 2. Format the size data for display in a table.
 * 3. Render the SizeClient component to display the list of sizes.
 */

// Import necessary modules and components
import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { SizeColumn } from "./components/columns";
import SizeClient from "./components/client";

/**
 * SizesPage component
 * @param {Object} props - The component's props.
 * @param {Object} props.params - An object containing the storeId to identify the store for fetching size data.
 */
const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetch size data based on the provided storeId and order it by creation date in descending order.
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the size data to match the structure expected by the SizeClient component.
  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the SizeClient component with the formatted size data */}
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
