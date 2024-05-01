// Import necessary libraries and modules
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

// Define a helper function to handle errors and send appropriate responses
const handleError = (error: any, statusCode = 500) => {
  console.log("[CATEGORY]", error);
  return new NextResponse("Internal error", { status: statusCode });
};

// Define an asynchronous function called GET that handles HTTP GET requests for retrieving a category by its ID
export async function GET(req, { params }) {
  try {
    // Check if the 'categoryId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Find a category with the specified 'categoryId' in the database including the associated billboard data
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    // Return a JSON response containing the retrieved category, including its associated billboard data
    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

// Define an asynchronous function called PATCH that handles HTTP PATCH requests for updating a category by its ID
export async function PATCH(req, { params }) {
  try {
    // Get the userId from the authenticated user using the auth() function
    const { userId } = auth();

    // Parse the JSON data from the request body
    const body = await req.json();

    // Extract the 'name', 'billboardId', 'slug', 'metaDescription', 'parentId', and 'description' properties from the request body
    const { name, billboardId, slug, metaDescription, parentId, description } =
      body;

    // Check if the user is not authenticated, and if so, return a 401 Unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Check if the 'categoryId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Find the store with the specified 'storeId' and 'userId' in the database
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    // Update the category with the specified 'categoryId' by setting the 'name', 'billboardId', 'slug', 'metaDescription', 'parentId', and 'description'
    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
        slug,
        metaDescription,
        parentId,
        description,
      },
    });

    // Return a JSON response containing the updated category
    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}

// Define an asynchronous function called DELETE that handles HTTP DELETE requests for deleting a category by its ID
export async function DELETE(req, { params }) {
  try {
    // Get the userId from the authenticated user using the auth() function
    const { userId } = auth();

    // Check if the 'categoryId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Find the store with the specified 'storeId' and 'userId' in the database
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    // Delete the category with the specified 'categoryId'
    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    // Return a JSON response indicating the successful deletion of the category
    return NextResponse.json(category);
  } catch (error) {
    return handleError(error);
  }
}
