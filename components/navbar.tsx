import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {
  const user = auth();

  if (!user.getSessionId()) {
    redirect("/sign-in");
  }

  const userId = user.getSessionId()?.userId;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const stores = await prismadb.store.findMany({
      where: {
        userId: userId,
      },
    });

    return (
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <StoreSwitcher items={stores} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching stores:", error);
    redirect("/sign-in");
  }
};

export default Navbar;
