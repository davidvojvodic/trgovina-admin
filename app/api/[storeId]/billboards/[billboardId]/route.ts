import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function GET(req, { params }) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    if (!billboard) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    const body = await req.json();

    if (!body.name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const updatedBillboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label: body.label,
        name: body.name,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
        displayOrder: body.displayOrder,
        startDate: body.startDate,
        endDate: body.endDate,
        tabletImageUrl: body.tabletImageUrl,
        mobileImageUrl: body.mobileImageUrl,
      },
    });

    if (updatedBillboard.count === 0) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    return NextResponse.json(updatedBillboard);
  } catch (error) {
    console.log("[BILLBOARDS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse(
        `User ${userId} does not have access to this store`,
        { status: 403 }
      );
    }

    const deletedBillboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    if (deletedBillboard.count === 0) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    return NextResponse.json(deletedBillboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
