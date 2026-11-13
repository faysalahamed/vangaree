import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const reviews = await prisma.review.findMany({
    where: { listingId: id },
    include: {
      user: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });

  const count = reviews.length;
  const average = count > 0 
    ? Math.round((reviews.reduce((acc, r) => acc + r.rating, 0) / count) * 10) / 10 
    : 0;

  return NextResponse.json({
    reviews,
    count,
    average
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Please login to leave a review" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { rating, comment } = body;

  const numRating = Number(rating);
  if (!numRating || numRating < 1 || numRating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  if (!comment || !comment.trim()) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  // Find listing to verify existence and notify owner
  const listing = await prisma.listing.findUnique({
    where: { id },
    select: { id: true, userId: true, phoneBrand: true, phoneModel: true }
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      listingId: id,
      userId,
      rating: numRating,
      comment: comment.trim()
    },
    include: {
      user: { select: { id: true, name: true } }
    }
  });

  // Notify the listing owner if not reviewing own ad
  if (listing.userId !== userId) {
    const reviewerName = session?.user?.name || "A user";
    await prisma.notification.create({
      data: {
        userId: listing.userId,
        title: "নতুন রিভিউ পেয়েছেন",
        message: `${reviewerName} আপনার ${listing.phoneBrand} ${listing.phoneModel} বিজ্ঞাপনে ${numRating}★ রেটিং দিয়েছেন।`,
        link: `/listings/${id}`
      }
    });
  }

  return NextResponse.json(review, { status: 201 });
}
