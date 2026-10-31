import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const OPPOSITE: Record<string, string> = {
  BUY: "SELL",
  SELL: "BUY",
  REPAIR_REQUEST: "REPAIR_OFFER",
  REPAIR_OFFER: "REPAIR_REQUEST"
};

// GET /api/listings/:id/matches — the opposite-type listings for the same part + model
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const matches = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      listingType: OPPOSITE[listing.listingType] as never,
      partType: listing.partType,
      phoneBrand: listing.phoneBrand,
      id: { not: listing.id }
    },
    include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 10
  });

  return NextResponse.json(matches);
}
