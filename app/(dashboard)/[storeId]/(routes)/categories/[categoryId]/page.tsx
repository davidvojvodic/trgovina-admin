// Components and Actions:
// 1. Import necessary modules and components
// 2. Define the BillboardPage component
//    - Takes params as a prop, including the categoryId and storeId
//    - Fetches category, billboards, and all categories using Suspense and SWR
//    - Renders a page to display a CategoryForm with initial data

import CategoryForm from "@/components/category-form";
import useSWR from "swr";
import prismadb from "@/lib/prismadb";
import { Category, Billboard } from "@prisma/client";

const fetcher = async (url: string) => {
  return prismadb. $kys.run(url);
};

const BillboardPage = ({ params }: { params: { categoryId: string; storeId: string } }) => {
  const { data: category } = useSWR<Category | null>(
    params?.categoryId ? `/category/findUnique?where={"id":"${params.categoryId}"}` : null,
    fetcher
  );

  const { data: billboards } = useSWR<Billboard[]>(
    params?.storeId ? `/billboard/findMany?where={"storeId":"${params.storeId}"}` : null,
    fetcher
  );

  const { data: allCategories } = useSWR<Category[]>(
    params?.storeId ? `/category/findMany?where={"storeId":"${params.storeId}"}` : null,
    fetcher
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the CategoryForm component with billboards and initial category data */}
        {category && billboards && allCategories && (
          <CategoryForm billboards={billboards} initialData={category} allCategories={allCategories} />
        )}
      </div>
    </div>
  );
};

export default BillboardPage;
