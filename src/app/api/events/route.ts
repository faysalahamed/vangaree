import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/events — log a view/search/filter event (see docs section 14.1)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

  const body = await req.json();
  const { sessionId, eventType, listingId, partType, phoneBrand } = body;

  if (!sessionId || !eventType) {
    return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
  }

  const event = await prisma.userEvent.create({
    data: { userId, sessionId, eventType, listingId, partType, phoneBrand }
  });

  return NextResponse.json({ id: event.id }, { status: 201 });
}
