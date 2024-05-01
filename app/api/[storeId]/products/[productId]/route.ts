// Import necessary modules and libraries
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define a helper function to check for required fields
const isFieldRequired = (field: string, value: any) => {
  if (!value) {
    throw new NextResponse(`${field} is required`, { status: 400 });
  }
};

// Define a helper function to check user access to the store
const checkUserStoreAccess = async (userId: string, storeId: string) => {
  const storeByUser = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!storeByUser) {
    throw new NextResponse(`User ${userId} does not have access to this store`, {
      status: 403,
    });
  }
};

// Define a helper function to handle errors
const handleError = (error: any) => {
  console.log("[PRODUCT]", error);
  throw new NextResponse("Internal error", { status: 500 });
};

// Define a GET function to retrieve product details
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    isFieldRequired("productId", params.productId);

    // Fetch product details including related data (images, category, color, size)
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
        attributes: true,
      },
    });

    // Respond with the product data in JSON format
    return NextResponse.json(product);
  } catch (error) {
    return handleError(error);
  }
}

// Define a PATCH function to update product details
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    isFieldRequired("userId", userId);

    const body = await req.json();

    const {
      name,
      description,
      price,
      discountPrice,
      discountPercent,
      stockStatus,
      stockQuantity,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
      attributes,
      slug,
      metaDescription,
    } = body;

    isFieldRequired("name", name);
    isFieldRequired("images", images);
    isFieldRequired("images.url", images.url);
    isFieldRequired("price", price);
    isFieldRequired("categoryId", categoryId);
    isFieldRequired("productId", params.productId);

    await checkUserStoreAccess(userId, params.storeId);

    // Update product details, including images
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        discountPrice,
        discountPercent,
        stockStatus,
        stockQuantity,
        attributes,
        slug,
        metaDescription,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    // Respond with the updated product data in JSON format
    return NextResponse.json(product);
  } catch (error) {
    return handleError(error);
  }
}

// Define a DELETE function to delete a product
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    isFieldRequired("userId", userId);
    isFieldRequired("productId", params.productId);

    await checkUserStoreAccess(userId, params.storeId);

    // Delete the product
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    // Respond with a success message in JSON format
    return NextResponse.json(product);
  } catch (error) {
    return handleError(error);
  }
}
