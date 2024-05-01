import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number;
}

interface OrderWithOrderItems extends prismadb.Order {
    orderItems: prismadb.OrderItem[];
}

export const getGraphRevenue = async (storeId: string) => {
    try {
        const paidOrders = await prismadb.order.findMany({
            where: {
                storeId,
                isPaid: true,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        const monthlyRevenue: { [key: number]: number } = {};

        for (const order of paidOrders as OrderWithOrderItems[]) {
            const month = order.createdAt.getMonth();
            let revenueForOrder = 0;

            for (const item of order.orderItems) {
                const productPrice = item.product.price.toNumber();
                revenueForOrder += productPrice;
            }

            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
        }

        const graphData = Object.entries(monthlyRevenue).map(
            ([month, revenue]): GraphData => {
                const monthIndex = parseInt(month, 10);
                return {
                    name: new Date(0, monthIndex, 1).toLocaleString("default", {
                        month: "long",
                    }),
                    total: revenue,
                };
            }
        );

        return graphData;
    } catch (error) {
        console.error("Error fetching paid orders:", error);
        return [];
    }
};
