// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called GET that handles HTTP GET requests for retrieving a color by its ID
export async function GET(req: Request, { params }: { params: { colorId: string } }) {
    try {
        // Step 1: Check if the 'colorId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Step 2: Find the color with the specified 'colorId' in the database using prismadb
        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId,
            },
        });

        // Step 3: Return a JSON response containing the retrieved color
        return NextResponse.json(color);
    } catch (error) {
        // Step 4: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[COLOR_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called PATCH that handles HTTP PATCH requests for updating a color by its ID
export async function PATCH(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract the 'name' and 'value' properties from the request body
        const { name, value } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Step 6: Check if the 'value' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        // Step 7: Check if the 'colorId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
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
            return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });
        }

        // Step 10: Update the color with the specified 'colorId' by setting its 'name' and 'value' properties
        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value,
            },
        });

        // Step 11: Return a JSON response containing the updated color
        return NextResponse.json(color);
    } catch (error) {
        // Step 12: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[COLOR_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called DELETE that handles HTTP DELETE requests for deleting a color by its ID
export async function DELETE(req: Request, { params }: { params: { storeId: string, colorId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 3: Check if the 'colorId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        // Step 4: Find the store with the specified 'storeId' and 'userId' in the database using prismadb
        const storeByUser = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        // Step 5: If the store is not found, return a 403 Forbidden response indicating that the user does not have access to the store
        if (!storeByUser) {
            return new NextResponse(`User ${userId} does not have access to this store`, { status: 403 });
        }

        // Step 6: Delete the color with the specified 'colorId'
        const color = await prismadb.color.deleteMany({
            where: {
                id: params.colorId,
            },
        });

        // Step 7: Return a JSON response indicating the deletion of the color
        return NextResponse.json(color);
    } catch (error) {
        // Step 8: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[COLOR_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
