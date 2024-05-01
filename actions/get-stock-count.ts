import prismadb from "@/lib/prismadb";

export const getStockCount = async (storeId: string): Promise<number> => {
  try {
    const stockCount = await prismadb.product.count({
      where: {
        storeId,
        isArchived: false,
      },
    });

    return stockCount;
  } catch (error) {
    console.error("Error while fetching stock count:", error);
    throw error;
  }
};
