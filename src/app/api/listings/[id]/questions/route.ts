import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const questions = await prisma.question.findMany({
    where: { listingId: id },
    include: {
      user: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(questions);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please login to ask a question" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { question } = body;

  if (!question || !question.trim()) {
    return NextResponse.json({ error: "Question cannot be empty" }, { status: 400 });
  }

  // Find listing to verify existence and notify owner
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { id: true, userId: true, phoneBrand: true, phoneModel: true, partType: true }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const created = await prisma.question.create({
    data: {
      listingId: id,
      userId,
      question: question.trim()
    },
    include: {
      user: { select: { id: true, name: true } }
    }
  });

  // Notify listing owner if someone else asked
  if (listing.userId !== userId) {
    const askerName = session?.user?.name || "একজন ক্রেতা";
    const productTitle = `${listing.phoneBrand} ${listing.phoneModel} (${listing.partType})`;
    await prisma.notification.create({
      data: {
        userId: listing.userId,
        title: `আপনার পণ্যে নতুন প্রশ্ন: ${productTitle}`,
        message: `${askerName} জানতে চেয়েছেন: "${question.trim().slice(0, 80)}${question.trim().length > 80 ? "..." : ""}"`,
        link: `/listings/${id}#questions`
      }
    });
  }

  return NextResponse.json(created, { status: 201 });
}
