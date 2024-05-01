"use client"; // Notable import statement

// Import necessary modules and components
import { Plus } from "lucide-react";
import Heading from "../../../../components/heading";
import { Button } from "../../../../components/ui/button";
import { Separator } from "../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "../../../../components/data-table";
import { ApiList } from "../../../../components/api-list";
import {
  CategoryColumn,
  categoriesColumns,
} from "./category-columns";

// Define the props interface for the CategoryClient component
interface CategoryClientProps {
  data: CategoryColumn[];
}

// Define the CategoryClient component
const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      {/* Render a section with heading, description, and a button to add a new category */}
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (Count: ${data.length})`} // Display the count of categories
          description="Manage categories for your store" // Description
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)} // Navigate to add new category page
        >
          <Plus className="mr-2 w-4 h-4" />
          Create new
        </Button>
      </div>
      <Separator /> {/* Render a separator */}
      <DataTable columns={categoriesColumns} data={data} />{" "}
      {/* Render DataTable to display category data */}
      <Heading title="API" description="API calls for categories" />{" "}
      {/* API heading */}
      <Separator /> {/* Render a separator */}
      <ApiList entityName="categories" entityIdName="categoryId" />{" "}
      {/* Render an APIList component */}
    </>
  );
};

export default CategoryClient;
