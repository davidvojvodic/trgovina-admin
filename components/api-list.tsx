"use client";

/**
 * @file ApiList.tsx
 * @description This file defines a component for displaying a list of API endpoints.
 */

import { useOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

// Define props for the ApiList component
interface ApiListProps {
  entityName: string; // Name of the API entity (e.g., "products", "categories")
  entityIdName: string; // Name of the API entity ID (e.g., "productId", "categoryId")
}

/**
 * ApiList is a component for displaying a list of API endpoints for a specific entity.
 * It includes GET, POST, PATCH, and DELETE endpoints with their titles, variants, and descriptions.
 */
export const ApiList = ({ entityName, entityIdName }: ApiListProps) => {
  const params = useParams();
  const origin = useOrigin();

  // Construct the base URL for API endpoints
  const baseUrl = `${origin}/api/${params.storeId}`;

  // Render a list of API endpoints as ApiAlert components
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  );
};
