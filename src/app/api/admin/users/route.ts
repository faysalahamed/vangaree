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

  const users = await prisma.user.findMany({
    where: {
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q } },
          { location: { contains: q, mode: "insensitive" } }
        ]
      })
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      role: true,
      location: true,
      createdAt: true,
      _count: {
        select: { listings: true }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return NextResponse.json(users);
}
