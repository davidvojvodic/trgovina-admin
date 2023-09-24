// Import necessary modules and libraries
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Define a POST function to create a new size
export async function POST(req: Request, { params }: { params: { storeId: string } }) {
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

        if (!params.storeId) {
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

        // Create a new size
        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            },
        });

        // Respond with the created size data in JSON format
        return NextResponse.json(size);
    } catch (error) {
        // Handle errors and log them
        console.log("[SIZES_POST]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}

// Define a GET function to retrieve sizes for a store
export async function GET(req: Request, { params }: { params: { storeId: string } }) {
    try {
        // Check if storeId is provided
        if (!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 });
        }

        // Fetch sizes for the specified store
        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        // Respond with the sizes data in JSON format
        return NextResponse.json(sizes);
    } catch (error) {
        // Handle errors and log them
        console.log("[SIZES_GET]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}
