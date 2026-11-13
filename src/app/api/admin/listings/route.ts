import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as { role?: string } | undefined)?.role;

  if (!session || userRole !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized: Admin privileges required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status");

  const listings = await prisma.listing.findMany({
    where: {
      ...(status && status !== "ALL" && { status: status as never }),
      ...(q && {
        OR: [
          { phoneModel: { contains: q, mode: "insensitive" } },
          { phoneBrand: { contains: q, mode: "insensitive" } },
          { partType: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
          { user: { name: { contains: q, mode: "insensitive" } } },
          { user: { phone: { contains: q } } }
        ]
      })
    },
    include: {
      user: { select: { id: true, name: true, phone: true } },
      photos: { take: 1, orderBy: { sortOrder: "asc" } }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json(listings);
}
