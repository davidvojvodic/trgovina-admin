// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called POST that handles HTTP POST requests for creating a product
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract various properties from the request body
        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
        } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Step 6: Check if the 'images' property is missing or empty in the request body, and if so, return a 400 Bad Request response
        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        // Step 7: Check if the 'price' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        // Step 8: Check if the 'categoryId' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        // Step 9: Check if the 'sizeId' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        // Step 10: Check if the 'colorId' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Step 11: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // Step 12: Find the store with the specified 'storeId' and 'userId' in the database using prismadb
        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        // Step 13: If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
        if (!storeByUser) {
            return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });
        }

        // Step 14: Create a new product in the database with the specified properties and images
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [...images.map((image: { url: string }) => image)],
                    },
                },
            },
        });

        // Step 15: Return a JSON response containing the created product
        return NextResponse.json(product);
    } catch (error) {
        // Step 16: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called GET that handles HTTP GET requests for retrieving products
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Parse the query parameters from the request URL
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        // Step 2: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        // Step 3: Retrieve products from the database based on the specified filters and options
        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false,
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Step 4: Return a JSON response containing the retrieved products
        return NextResponse.json(products);
    } catch (error) {
        // Step 5: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
