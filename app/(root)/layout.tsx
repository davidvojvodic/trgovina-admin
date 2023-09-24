/**
 * @file SetupLayout.tsx
 * @description This file defines a layout component for setting up the application.
 */

// Import necessary modules and components
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * SetupLayout is a layout component used to set up the application.
 * @param children - The child components to be rendered within the layout.
 */
export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user's ID from the authentication module
  const { userId } = auth();

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirect("/sign-in");
  }

  // Find the store associated with the user
  const store = await prismadb.store.findFirst({
    where: {
      userId: userId,
    },
  });

  // If a store is found, redirect to the store's page
  if (store) {
    redirect(`/${store.id}`);
  }

  // Render the child components
  return <>{children}</>;
}
