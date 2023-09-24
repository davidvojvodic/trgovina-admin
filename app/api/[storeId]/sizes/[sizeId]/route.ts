// Import necessary modules and libraries
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define a GET function to retrieve a specific size by its ID
export async function GET(req: Request, { params }: { params: { sizeId: string } }) {
    try {
        // Check if sizeId is provided
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
        }

        // Fetch the size with the specified ID
        const size = await prismadb.size.findUnique({
            where: {
                id: params.sizeId,
            },
        });

        // Respond with the size data in JSON format
        return NextResponse.json(size);
    } catch (error) {
        // Handle errors and log them
        console.log("[SIZE_GET]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define a PATCH function to update a specific size by its ID
export async function PATCH(req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
    try {
        // Authenticate the user and extract the request body
        const { userId } = auth();
        const body = await req.json();

        // Destructure relevant data from the request body
        const { name, value } = body;

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if required fields are provided
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!value) {
            return new NextResponse("Value is required", { status: 400 });
        }

        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        // Update the specified size with new data
        const size = await prismadb.size.updateMany({
            where: {
                id: params.sizeId,
            },
            data: {
                name,
                value,
            },
        });

        // Respond with the updated size data in JSON format
        return NextResponse.json(size);
    } catch (error) {
        // Handle errors and log them
        console.log("[SIZES_PATCH]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define a DELETE function to delete a specific size by its ID
export async function DELETE(req: Request, { params }: { params: { storeId: string; sizeId: string } }) {
    try {
        // Authenticate the user
        const { userId } = auth();

        // Check if the user is authenticated
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Check if sizeId is provided
        if (!params.sizeId) {
            return new NextResponse("Size id is required", { status: 400 });
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

        // Delete the specified size
        const size = await prismadb.size.deleteMany({
            where: {
                id: params.sizeId,
            },
        });

        // Respond with a success message in JSON format
        return NextResponse.json(size);
    } catch (error) {
        // Handle errors and log them
        console.log("[SIZE_DELETE]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}
