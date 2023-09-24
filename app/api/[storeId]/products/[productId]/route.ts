// Import necessary modules and libraries
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define a GET function to retrieve product details
export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        // Check if productId is provided
        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

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
            },
        });

        // Respond with the product data in JSON format
        return NextResponse.json(product);
    } catch (error) {
        // Handle errors and log them
        console.log("[PRODUCT_GET]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define a PATCH function to update product details
export async function PATCH(req: Request, { params }: { params: { storeId: string; productId: string } }) {
    try {
        // Authenticate the user and extract the request body
        const { userId } = auth();
        const body = await req.json();

        // Destructure relevant data from the request body
        const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if required fields are provided
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Check if the user has access to the store
        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUser) {
            return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });
        }

        // Update product details, including images
        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
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
                        data: [
                            ...images.map((image: { url: string }) => image),
                        ],
                    },
                },
            },
        });

        // Respond with the updated product data in JSON format
        return NextResponse.json(product);
    } catch (error) {
        // Handle errors and log them
        console.log("[PRODUCT_PATCH]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define a DELETE function to delete a product
export async function DELETE(req: Request, { params }: { params: { storeId: string; productId: string } }) {
    try {
        // Authenticate the user
        const { userId } = auth();

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Check if productId is provided
        if (!params.productId) {
            return new NextResponse("Product id is required", { status: 400 });
        }

        // Check if the user has access to the store
        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUser) {
            return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });
        }

        // Delete the product
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            },
        });

        // Respond with a success message in JSON format
        return NextResponse.json(product);
    } catch (error) {
        // Handle errors and log them
        console.log("[PRODUCT_DELETE]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}
