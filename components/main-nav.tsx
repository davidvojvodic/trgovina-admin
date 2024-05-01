"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({ className, ...props }) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    { path: `/${params.storeId}`, name: "Dashboard" },
    { path: `/${params.storeId}/billboards`, name: "Billboards" },
    { path: `/${params.storeId}/categories`, name: "Categories" },
    { path: `/${params.storeId}/sizes`, name: "Sizes" },
    { path: `/${params.storeId}/colors`, name: "Colors" },
    { path: `/${params.storeId}/attributes`, name: "Attributes" },
    { path: `/${params.storeId}/products`, name: "Products" },
    { path: `/${params.storeId}/orders`, name: "Orders" },
    // { path: `/${params.storeId}/enquiries`, name: "Enquiries" },
    { path: `/${params.storeId}/settings`, name: "Settings" },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === route.path
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.name}
        </Link>
      ))}
    </nav>
  );
}
