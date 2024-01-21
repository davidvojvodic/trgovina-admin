// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called PATCH that handles HTTP PATCH requests

export async function GET(req: Request, {params}: {params: {storeId: string}}) {
    try {
        if(!params.storeId) {
            return new NextResponse("Store ID is required", {status: 400});
        }

        const store = await prismadb.store.findUnique({
            where: {
                id: params.storeId
            },
        });

        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_GET]", error);
        return new NextResponse("Internal error", {status: 500});
    }
}
export async function PATCH(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract the 'name' property from the request body
        const { name, storeImage } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Step 6: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Step 7: Update the store with the specified 'storeId' and 'userId' in the database using prismadb
        const store = await prismadb.store.updateMany({
            where: {
                id: params.storeId,
                userId: userId,
            },
            data: {
                name,
                storeImage,
            },
        });

        // Step 8: Return a JSON response containing the updated store
        return NextResponse.json(store);
    } catch (error) {
        // Step 9: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[STORE_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called DELETE that handles HTTP DELETE requests
export async function DELETE(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 3: Check if the 'storeId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Step 4: Delete the store with the specified 'storeId' and 'userId' from the database using prismadb
        const store = await prismadb.store.deleteMany({
            where: {
                id: params.storeId,
                userId: userId,
            },
        });

        // Step 5: Return a JSON response containing the deleted store
        return NextResponse.json(store);
    } catch (error) {
        // Step 6: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[STORE_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
