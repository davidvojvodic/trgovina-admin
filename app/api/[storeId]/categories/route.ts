// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called POST that handles HTTP POST requests for creating categories
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Step 1: Get the userId from the authenticated user using the auth() function
    const { userId } = auth();

    // Step 2: Parse the JSON data from the request body
    const body = await req.json();

    // Step 3: Extract the 'name' and 'billboardId' properties from the request body
    const { name, billboardId, slug, metaDescription, parent, description } =
      body;

    // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    // Step 6: Check if the 'billboardId' property is missing in the request body, and if so, return a 400 Bad Request response
    // if (!billboardId) {
    //     return new NextResponse("Billboard id is required", { status: 400 });
    // }

    // Step 7: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Step 8: Find the store with the specified 'storeId' and 'userId' in the database using prismadb
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // Step 9: If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    // Step 10: Create a new category with the provided 'name', 'billboardId', and 'storeId'
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
        slug,
        metaDescription,
        description,
        parent,
      },
    });

    // Step 11: Return a JSON response containing the created category
    return NextResponse.json(category);
  } catch (error) {
    // Step 12: Handle any errors that occur during the process and return a 500 Internal Server Error response
    console.log("[CATEGORIES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Define an asynchronous function called GET that handles HTTP GET requests for retrieving categories
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Step 1: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Step 2: Find all categories with the specified 'storeId' in the database using prismadb
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Step 3: Return a JSON response containing the retrieved categories
    return NextResponse.json(categories);
  } catch (error) {
    // Step 4: Handle any errors that occur during the process and return a 500 Internal Server Error response
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
