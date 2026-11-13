import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.listing.findUnique({
    where: { id }
  });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Forbidden: You do not own this listing" }, { status: 403 });
  }

  const body = await req.json();
  const { status, price } = body;

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      ...(status && { status }),
      ...(price !== undefined && { price: price === null ? null : Number(price) })
    }
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const existing = await prisma.listing.findUnique({
    where: { id }
  });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json({ error: "Forbidden: You do not own this listing" }, { status: 403 });
  }

  await prisma.listing.delete({
    where: { id }
  });

  return NextResponse.json({ success: true, message: "Listing deleted successfully" });
}
