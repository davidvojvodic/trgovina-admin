"use client"; // Notable import statement
// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the CategoryClient component
//    - Takes data as a prop, representing category column data
//    - Renders a page for managing categories
//    - Displays a heading with the count of categories and a description
//    - Provides a button to add a new category
//    - Renders a DataTable to display category data
//    - Displays a heading for API calls related to categories
//    - Renders an APIList component for category API calls

// Import necessary modules and components

import { Plus } from "lucide-react";
import Heading from "../../../../../../components/heading";
import { Button } from "../../../../../../components/ui/button";
import { Separator } from "../../../../../../components/ui/separator";
import { useParams, useRouter } from "next/navigation";

import { DataTable } from "../../../../../../components/data-table";
import { ApiList } from "../../../../../../components/api-list";
import { CategoryColumn, categoriesColumns } from "./category-colums";

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
          title={`Kategorije (${data.length})`} // Display the count of categories
          description="Upravljajte kategorije za svojo trgovino" // Description
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)} // Navigate to add new category page
        >
          <Plus className="mr-2 w-4 h-4" />
          Dodaj novo
        </Button>
      </div>
      <Separator /> {/* Render a separator */}
      <DataTable
        searchKey="name"
        columns={categoriesColumns}
        data={data}
      />{" "}
      {/* Render DataTable to display category data */}
      <Heading title="API" description="API klici za kategorije" />{" "}
      {/* API heading */}
      <Separator /> {/* Render a separator */}
      <ApiList entityName="categories" entityIdName="categoryId" />{" "}
      {/* Render an APIList component */}
    </>
  );
};

export default CategoryClient;
