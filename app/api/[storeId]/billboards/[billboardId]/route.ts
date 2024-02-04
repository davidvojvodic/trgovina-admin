// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called GET that handles HTTP GET requests
export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
    try {
        // Step 1: Check if the 'billboardId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        // Step 2: Find the billboard with the specified 'billboardId' in the database using prismadb
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        // Step 3: Return a JSON response containing the retrieved billboard
        return NextResponse.json(billboard);
    } catch (error) {
        // Step 4: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called PATCH that handles HTTP PATCH requests
export async function PATCH(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract the 'label' and 'imageUrl' properties from the request body
        const { label, imageUrl, name } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Step 6: Check if the 'imageUrl' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
        }

        // Step 7: Check if the 'billboardId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        // Step 10: Update the specified billboard with the provided 'label' and 'imageUrl'
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                name,
                imageUrl,
            },
        });

        // Step 11: Return a JSON response containing the updated billboard
        return NextResponse.json(billboard);
    } catch (error) {
        // Step 12: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[BILLBOARDS_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define an asynchronous function called DELETE that handles HTTP DELETE requests
export async function DELETE(req: Request, { params }: { params: { storeId: string, billboardId: string } }) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 3: Check if the 'billboardId' parameter is missing in the request, and if so, return a 400 Bad Request response
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        // Step 6: Delete the specified billboard
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            },
        });

        // Step 7: Return a JSON response indicating the successful deletion of the billboard
        return NextResponse.json(billboard);
    } catch (error) {
        // Step 8: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
