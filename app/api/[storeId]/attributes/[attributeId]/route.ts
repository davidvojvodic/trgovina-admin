// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; attributeId: string } }
) {
  if (!params.storeId || !params.attributeId) {
    return new NextResponse(
      params.storeId ? "Attribute ID is required" : "Store ID is required",
      { status: 400 }
    );
  }

  try {
    const attribute = await prismadb.attribute.findUnique({
      where: {
        id: params.attributeId,
      },
    });

    if (!attribute) {
      return new NextResponse("Attribute not found", { status: 404 });
    }

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
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!params.attributeId) {
    return new NextResponse("Attribute ID is required", { status: 400 });
 
