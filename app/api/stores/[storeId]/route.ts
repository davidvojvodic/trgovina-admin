// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define a helper function to check for required params
const checkRequiredParams = (params: { storeId: string }, paramName: string) => {
  if (!params[paramName]) {
    return new NextResponse(`${paramName} is required`, { status: 400 });
  }
};

// Define a helper function to check for required body properties
const checkRequiredBodyProperties = (body: any, propertyNames: string[]) => {
  for (const property of propertyNames) {
    if (!body[property]) {
      return new NextResponse(`${property} is required`, { status: 400 });
    }
  }
};

// Define an asynchronous function called GET that handles HTTP GET requests
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    checkRequiredParams(params, "storeId");

    const store = await prismadb.store.findUnique({
      where: {
        id: params.storeId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Define an asynchronous function called PATCH that handles HTTP PATCH requests
export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    checkRequiredParams(params, "storeId");
    const body = await req.json();
    checkRequiredBodyProperties(body, ["name"]);

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
      data: {
        name: body.name,
        storeImage: body.storeImage,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Define an asynchronous function called DELETE that handles HTTP DELETE requests
export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    checkRequiredParams(params, "storeId");

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
