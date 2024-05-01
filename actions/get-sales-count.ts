import prismadb from "@/lib/prismadb";

export const getSalesCount = async (storeId: string): Promise<number> => {
  try {
    const salesCount = await prismadb.order.count({
      where: {
        storeId,
        isPaid: true,
      },
    });

    return salesCount;
  } catch (error) {
    console.error("Error while fetching sales count:", error);
    throw error;
  }
};
