/* This code snippet exports a function getGraphRevenue that calculates the monthly revenue for a given store.
It does this by querying the prismadb for paid orders associated with the store and summing up the prices of all the products in each order.
The function then returns an array of GraphData objects, where each object represents a month and its corresponding revenue. */

import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string;
    total: number
}

export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true,
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    });

    const monthlyRevenue: {[key: number]: number} = {}

    for (const order of paidOrders) {
        const month = order.createdAt.getMonth()
        let revenueForOrder = 0

        for(const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber()
        }

        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder
    }

    const graphData: GraphData[] = [
        {name: "Jan", total: 0},
        {name: "Feb", total: 0},
        {name: "Mar", total: 0},
        {name: "Apr", total: 0},
        {name: "Maj", total: 0},
        {name: "Jun", total: 0},
        {name: "Jul", total: 0},
        {name: "Avg", total: 0},
        {name: "Sep", total: 0},
        {name: "Oct", total: 0},
        {name: "Nov", total: 0},
        {name: "Dec", total: 0},
    ];

    for(const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
    }

    return graphData
}