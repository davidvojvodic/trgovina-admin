// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; attributeId: string } }
) {
  try {
    // Step 1: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    } else if (!params.attributeId) {
      return new NextResponse("Attribute ID is required", { status: 400 });
    }

    const attribute = await prismadb.attribute.findUnique({
      where: {
        id: params.attributeId,
      },
    });
    return NextResponse.json(attribute);
  } catch (error) {
    console.log("[ATTRIBUTE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; attributeId: string } }
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

    if (!params.attributeId) {
      return new NextResponse("Attribute ID is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    const attribute = await prismadb.attribute.update({
      where: {
        id: params.attributeId,
      },
      data: {
        key,
        value,
      },
    });
    return NextResponse.json(attribute);
  } catch (error) {
    console.log("[ATTRIBUTE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; attributeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.attributeId) {
      return new NextResponse("Attribute ID is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    const attribute = await prismadb.attribute.delete({
      where: {
        id: params.attributeId,
      },
    });
    return NextResponse.json(attribute);
  } catch (error) {
    console.log("[ATTRIBUTE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
