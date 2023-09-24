// Import necessary libraries and modules
import prismadb from "@/lib/prismadb"; // Import the prismadb module
import { auth } from "@clerk/nextjs"; // Import the auth function from the Clerk library
import { NextResponse } from "next/server"; // Import the NextResponse class from the next/server module

// Define an asynchronous function called POST that handles HTTP POST requests
export async function POST(req: Request) {
    try {
        // Step 1: Get the userId from the authenticated user using the auth() function
        const { userId } = auth();

        // Step 2: Parse the JSON data from the request body
        const body = await req.json();

        // Step 3: Extract the 'name' property from the request body
        const { name } = body;

        // Step 4: Check if the user is not authenticated, and if so, return a 401 Unauthorized response
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Step 5: Check if the 'name' property is missing in the request body, and if so, return a 400 Bad Request response
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Step 6: Create a new store in the database using prismadb
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        // Step 7: Return a JSON response containing the created store
        return NextResponse.json(store);
    } catch (error) {
        // Step 8: Handle any errors that occur during the process and return a 500 Internal Server Error response
        console.log("[STORES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
