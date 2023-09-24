import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  // Get the current user's ID using the auth() function from Clerk.
  const { userId } = auth();

  // If the user is not authenticated, redirect them to the sign-in page.
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch a list of stores associated with the user from the database.
  const stores = await prismadb.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {/* Render the store switcher component with the fetched stores. */}
        <StoreSwitcher items={stores} />

        {/* Render the main navigation component. */}
        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          {/* Render the UserButton component for user actions. */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
