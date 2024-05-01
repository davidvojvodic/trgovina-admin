// Import necessary libraries and modules
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

// Define a helper function to handle errors and send appropriate responses
const handleError = (statusCode: number, message: string) => {
  return new NextResponse(message, { status: statusCode });
};

// Define an asynchronous function called POST that handles HTTP POST requests
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Get the userId from the authenticated user using the auth() function
    const { userId } = auth();

    // Parse the JSON data from the request body
    const body = await req.json();

    // Extract the required properties from the request body
    const {
      label,
      imageUrl,
      name,
      isActive,
      displayOrder,
      startDate,
      endDate,
      tabletImageUrl,
      mobileImageUrl,
      categories,
    } = body;

    // Check if the user is not authenticated, and if so, return a 401 Unauthorized response
    if (!userId) {
      return handleError(401, "Unauthorized");
    }

    // Check if the 'label' property is missing in the request body, and if so, return a 400 Bad Request response
    if (!name) {
      return handleError(400, "Name is required");
    }

    // Check if the 'imageUrl' property is missing in the request body, and if so, return a 400 Bad Request response
    if (!imageUrl) {
      return handleError(400, "Image URL is required");
    }

    // Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return handleError(400, "Store id is required");
    }

    // Find the store with the specified 'storeId' and 'userId' in the database using prismadb
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
    if (!storeByUser) {
      return handleError(403, `User ${userId} does not have access to this store`);
    }

    // Create a new billboard in the database with the provided 'label', 'imageUrl', and 'storeId'
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        name,
        isActive,
        displayOrder,
        categories,
        startDate,
        endDate,
        tabletImageUrl,
        mobileImageUrl,
        storeId: params.storeId,
      },
    });

    // Return a JSON response containing the created billboard
    return NextResponse.json(billboard);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Define an asynchronous function called GET that handles HTTP GET requests
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return handleError(400, "Store id is required");
    }

    // Find all billboards associated with the specified 'storeId' in the database using prismadb
    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Return a JSON response containing the retrieved billboards
    return NextResponse.json(billboards);
  } catch (error) {
    // Log the error and return a 500 Internal Server Error response
    console.log("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
