// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { key, value } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!key) {
      return new NextResponse("Key is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
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
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Step 10: Create a new attribute in the database
    const attribute = await prismadb.attribute.create({
      data: {
        key,
        value,
        storeId: params.storeId,
      },
    });

    // Step 11: Return a JSON response containing the created attribute
    return NextResponse.json(attribute);
  } catch (error) {
    // Step 12: Handle any errors that occur during the process and return a 500 Internal Server Error response
    console.log("[ATTRIBUTE_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Step 1: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Get all attributes of the store
    const attributes = await prismadb.attribute.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(attributes);
  } catch (error) {
    console.log("[ATTRIBUTE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// This route should be used for development purposes only
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Step 1: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Step 2: Delete all attributes of the store
    await prismadb.attribute.deleteMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response("Attributes deleted successfully");
  } catch (error) {
    console.log("[ATTRIBUTE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
