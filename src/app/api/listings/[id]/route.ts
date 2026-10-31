import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      user: { select: { id: true, name: true, location: true, createdAt: true, phone: true } }
    }
  });

  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(listing);
}

export async function PUT(req: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const updated = await prisma.listing.update({
    where: { id },
    data: body
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const existing = await prisma.listing.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
