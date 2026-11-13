import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please login to answer" }, { status: 401 });
  }

  const { id, questionId } = await params;
  const body = await req.json();
  const { answer } = body;

  if (!answer || !answer.trim()) {
    return NextResponse.json({ error: "Answer cannot be empty" }, { status: 400 });
  }

  // Verify listing ownership
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { userId: true, phoneBrand: true, phoneModel: true }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.userId !== userId) {
    return NextResponse.json({ error: "Only the seller can answer questions on this listing" }, { status: 403 });
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: {
      answer: answer.trim(),
      answeredAt: new Date()
    },
    include: {
      user: { select: { id: true, name: true } }
    }
  });

  // Notify the user who asked the question
  if (updated.userId !== userId) {
    const sellerName = session?.user?.name || "সেলার";
    const productTitle = `${listing.phoneBrand} ${listing.phoneModel}`;
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: `আপনার প্রশ্নের উত্তর এসেছে: ${productTitle}`,
        message: `${sellerName} উত্তর দিয়েছেন: "${answer.trim().slice(0, 80)}${answer.trim().length > 80 ? "..." : ""}"`,
        link: `/listings/${id}#questions`
      }
    });
  }

  return NextResponse.json(updated);
}
