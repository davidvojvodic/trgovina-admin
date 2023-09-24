/**
 * @file ProductPage.tsx
 * @description This component is responsible for displaying a form to edit product information.
 * It retrieves the necessary data from a database using Prismadb and passes it to the ProductForm component for editing.
 *
 * Functionality:
 * 1. The component fetches product data, including associated images, based on the provided productId.
 * 2. It fetches available categories, sizes, and colors for product attributes from the database based on the storeId.
 * 3. The fetched data is passed as initial values to the ProductForm component for editing.
 * 4. Users can edit the product information using the form.
 */

// Import necessary modules and components
import ProductForm from "@/components/product-form";
import prismadb from "@/lib/prismadb";

/**
 * ProductPage component
 * @param {Object} props - The component's props.
 * @param {Object} props.params - An object containing productId and storeId to identify the product and store for fetching data.
 */
const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  // Fetch product data based on the provided productId, including associated images
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  // Fetch categories available for selection
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  // Fetch sizes available for selection
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  // Fetch colors available for selection
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render a product form with initial data for editing */}
        <ProductForm
          initialData={product}
          categories={categories}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
