// Import necessary modules and components
import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { OrderColumn } from "./components/columns";
import OrderClient from "./components/client";

// Define the OrdersPage component
const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  // Fetch orders from the database based on the storeId
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the fetched orders into the desired structure
  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "), // Concatenate product names
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ), // Calculate and format total price
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format date
  }));

  // Return the OrdersPage component JSX
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />{" "}
        {/* Render the client component with formatted orders */}
      </div>
    </div>
  );
};

export default OrdersPage; // Export the OrdersPage component
