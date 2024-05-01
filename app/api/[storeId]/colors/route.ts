// Import necessary libraries and modules
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Define a helper function to check for missing required fields
const requiredFields = (fields: string[]) => {
  return (req: Request) => {
    for (const field of fields) {
      if (!req.body[field]) {
        return new NextResponse(`${field} is required`, { status: 400 });
      }
    }
  };
};

// Define a helper function to check for missing required params
const requiredParams = (params: string[]) => {
  return (req: Request, { params: reqParams }: { params: { [key: string]: string } }) => {
    for (const param of params) {
      if (!reqParams[param]) {
        return new NextResponse(`${param} is required`, { status: 400 });
      }
    }
  };
};

// Define an asynchronous function called POST that handles HTTP POST requests for creating a color
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Check for missing required fields
    const hasMissingFields = requiredFields(["name", "value"])(req);
    if (hasMissingFields) return hasMissingFields;

    // Check for missing required params
    const hasMissingParams = requiredParams(["storeId"])(req, { params });
    if (hasMissingParams) return hasMissingParams;

    // Get the userId from the authenticated user
    const { userId } = auth();

    // Extract the 'name' and 'value' properties from the request body
    const { name, value } = await req.json();

    // Check if the user is not authenticated
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    // Find the store with the specified 'storeId' and 'userId' in the database
    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // If the store is not found, return a 403 Forbidden response
    if (!storeByUser)
      return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });

    // Create a new color with the specified 'name', 'value', and 'storeId'
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    // Return a JSON response containing the newly created color
    return NextResponse.json(color);
  } catch (error) {
    // Handle any errors that occur during the process
    console.log("[COLORS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Define an asynchronous function called GET that handles HTTP GET requests for retrieving colors by store ID
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    // Check if the 'storeId' parameter is missing in the request
    const hasMissingParams = requiredParams(["storeId"])(req, { params });
    if (hasMissingParams) return hasMissingParams;

    // Find all colors with the specified 'storeId' in the database
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    // Return a JSON response containing the retrieved colors
    return NextResponse.json(colors);
  } catch (error) {
    // Handle any errors that occur during the process
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
