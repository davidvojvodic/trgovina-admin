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

export async function POST(req:Request, {params}: {params: {storeId:string}}) {
    try {
        const {userId} = auth()

        const body = await req.json()

        const {name, email, message} = body

        if(!userId) {
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!name) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!email) {
            return new NextResponse("Name is required", {status: 400})
        }

        if(!message) {
            return new NextResponse("Name is required", {status: 400})
        }

        const enquiry = await prismadb.enquiry.create({
            data: {
                name,
                email,
                message,
                storeId: params.storeId
            }
        })

        return NextResponse.json(enquiry)
    } catch (error) {
        console.log("[ENQUIRIES_POST]", error)
        return new NextResponse("Internal error", {status: 500})
    }
}