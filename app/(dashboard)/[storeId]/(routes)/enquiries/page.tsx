import React from "react";
import EnquiryClient from "./components/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { EnquiryColumn } from "./components/columns";
import { format } from "date-fns";

const EnquiriesPage = async ({ params }: { params: { storeId: string } }) => {
  // Get the authenticated user's userId
  const { userId } = auth();

  // Check if the user is not authenticated. If not, redirect them to the sign-in page.
  if (!userId) {
    redirect("/sign-in");
  }

  const enquiries = await prismadb.enquiry.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Format the fetched orders into the desired structure
  const formattedEnquiries: EnquiryColumn[] = enquiries.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    message: item.message,
    createdAt: format(item.createdAt, "MMMM do, yyyy"), // Format date
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EnquiryClient data={formattedEnquiries} />
        {/* Render the client component with formatted orders */}
      </div>
    </div>
  );
};

export default EnquiriesPage;
