// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called POST that handles HTTP POST requests
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract the 'label' and 'imageUrl' properties from the request body
        const { label, imageUrl } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'label' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        // Step 6: Check if the 'imageUrl' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        // Step 7: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
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

        // Step 10: Create a new billboard in the database with the provided 'label', 'imageUrl', and 'storeId'
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            },
        });

        // Step 11: Return a JSON response containing the created billboard
        return NextResponse.json(billboard);
    } catch (error) {
        // Step 12: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[BILLBOARDS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called GET that handles HTTP GET requests
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Step 2: Find all billboards associated with the specified 'storeId' in the database using prismadb
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        // Step 3: Return a JSON response containing the retrieved billboards
        return NextResponse.json(billboards);
    } catch (error) {
        // Step 4: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[BILLBOARDS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
