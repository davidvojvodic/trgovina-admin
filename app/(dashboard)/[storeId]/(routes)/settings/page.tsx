/**
 * @file SettingsPage.tsx
 * @description This component is responsible for displaying a form to edit store settings.
 * It retrieves the necessary data from a database using Prismadb and ensures that only authenticated users
 * who own the store can access and edit the settings.
 *
 * Functionality:
 * 1. Check if the user is authenticated. If not, redirect them to the sign-in page.
 * 2. Fetch store data based on the provided storeId and userId to ensure that only store owners can access settings.
 * 3. Render a form with initial data for editing the store settings.
 */

// Import necessary modules and components
import SettingsForm from "@/components/settings-form";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

/**
 * SettingsPage component
 * @param {Object} props - The component's props.
 * @param {Object} props.params - An object containing the storeId to identify the store for fetching data.
 */
const SettingsPage = async ({ params }: { params: { storeId: string } }) => {
  // Get the authenticated user's userId
  const { userId } = auth();

  // Check if the user is not authenticated. If not, redirect them to the sign-in page.
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch store data based on the provided storeId and userId to ensure ownership.
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });

  // If the store does not exist or does not belong to the authenticated user, redirect them to the home page.
  if (!store) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {/* Render a form with initial data for editing store settings */}
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
