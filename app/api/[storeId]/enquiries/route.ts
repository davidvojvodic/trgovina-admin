import prismadb from "@/lib/prismadb";
import{auth} from "@clerk/nextjs"
import { NextResponse } from "next/server";

export async function GET(req: Request, {params}: {params: {enquiryId: string}}) {
    try {
        if(!params.enquiryId) {
            return new NextResponse("Enquiry id is required", {status: 400})
        }

        const enquiry = await prismadb.enquiry.findUnique({
            where: {
                id: params.enquiryId,
            },
            
        })

        return NextResponse.json(enquiry)
    } catch (error) {
        console.log("[ENQUIRY_GET]", error);
        // Respond with an internal server error status and message
        return new NextResponse("Internal error", { status: 500 });
    }
}