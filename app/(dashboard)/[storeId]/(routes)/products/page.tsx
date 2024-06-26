/**
 * Products Page
 *
 * This page component fetches and displays a list of products for a specific store.
 * It retrieves product data from the database, formats it for display, and renders
 * it using the ProductClient component.
 *
 * @param {Object} params  - The route parameters, including the 'storeId'.
 * @returns {JSX.Element} - The rendered Products Page component.
 */
import BillboardClient from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-client";
import { BillboardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/billboard-columns";
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductColumn } from "./components/columns";
import ProductClient from "./components/client";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetch products data from the database
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the products data for display
  const formattedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: formatter.format(product.price.toNumber()),
    category: product.category.name,
    size: product.size?.name || "N/A",
    color: product.color?.value || "N/A",
    createdAt: format(product.createdAt, "MMMM do, yyyy"),
  }));

  // Return the JSX content to render
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render the ProductClient component with the formatted product data */}
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
