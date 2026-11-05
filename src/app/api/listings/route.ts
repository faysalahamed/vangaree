import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/listings?partType=Display&brand=Samsung&type=SELL&q=iphone&minPrice=500&maxPrice=3000&condition=USED_GOOD&sort=price_asc
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const partType = searchParams.get("partType") ?? undefined;
  const brand = searchParams.get("brand") ?? undefined;
  const listingType = searchParams.get("type") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const location = searchParams.get("location") ?? undefined;
  const condition = searchParams.get("condition") ?? undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sort = searchParams.get("sort") ?? "latest";

  const orderBy =
    sort === "oldest" ? { createdAt: "asc" as const } :
    sort === "price_asc" ? { price: "asc" as const } :
    sort === "price_desc" ? { price: "desc" as const } :
    { createdAt: "desc" as const }; // "latest" default

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(partType && { partType }),
      ...(brand && { phoneBrand: brand }),
      ...(listingType && { listingType: listingType as never }),
      ...(condition && { condition: condition as never }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...((minPrice || maxPrice) && {
        price: {
          ...(minPrice && { gte: Number(minPrice) }),
          ...(maxPrice && { lte: Number(maxPrice) })
        }
      }),
      ...(q && {
        OR: [
          { phoneModel: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      })
    },
    include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy,
    take: 40
  });

  // Log the search as a lightweight interest signal (see docs 14.1)
  if (q || partType || brand) {
    const sessionId = req.headers.get("x-session-id") ?? "anonymous";
    await prisma.userEvent.create({
      data: {
        sessionId,
        eventType: "SEARCH",
        partType: partType ?? null,
        phoneBrand: brand ?? null
      }
    });
  }

  return NextResponse.json(listings);
}

// POST /api/listings — create a listing (auth required)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const body = await req.json();
  const {
    listingType,
    partType,
    phoneBrand,
    phoneModel,
    condition,
    price,
    description,
    location,
    photoUrls
  } = body;

  if (!listingType || !partType || !phoneBrand || !phoneModel || !condition || !description || !location) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const listing = await prisma.listing.create({
    data: {
      userId,
      listingType,
      partType,
      phoneBrand,
      phoneModel,
      condition,
      price: price ? Number(price) : null,
      description,
      location,
      photos: {
        create: (photoUrls ?? []).map((url: string, i: number) => ({ url, sortOrder: i }))
      }
    },
    include: { photos: true }
  });

  return NextResponse.json(listing, { status: 201 });
}
