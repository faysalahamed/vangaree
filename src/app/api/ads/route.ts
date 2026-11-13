import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/ads?placement=HOME | TOP_SEARCH | BOTH | ALL
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get("placement"); // "HOME", "TOP_SEARCH", "BOTH", "ALL"
    const isAll = searchParams.get("all") === "true";

    const now = new Date();

    const where: any = {};

    if (!isAll) {
      where.status = "ACTIVE";
      where.startsAt = { lte: now };
      where.OR = [
        { endsAt: null },
        { endsAt: { gte: now } }
      ];
    }

    if (placement && placement !== "ALL") {
      const placementFilter = {
        OR: [
          { placement: placement },
          { placement: "BOTH" }
        ]
      };
      if (where.AND) {
        where.AND.push(placementFilter);
      } else {
        where.AND = [placementFilter];
      }
    }

    const ads = await prisma.ad.findMany({
      where,
      include: {
        listing: {
          include: {
            photos: { take: 1, orderBy: { sortOrder: "asc" } },
            user: { select: { name: true, phone: true } }
          }
        }
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" }
      ],
      take: 50
    });

    return NextResponse.json({ ads });
  } catch (error) {
    console.error("Error fetching ads:", error);
    return NextResponse.json({ error: "Failed to fetch ads", ads: [] }, { status: 500 });
  }
}

// POST /api/ads (Admin only - create new advertisement)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      imageUrl,
      targetUrl,
      sponsorName,
      badge,
      placement,
      priority,
      status,
      listingId,
      startsAt,
      endsAt
    } = body;

    const newAd = await prisma.ad.create({
      data: {
        title: title?.trim() || null,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        targetUrl: targetUrl?.trim() || "/listings",
        sponsorName: sponsorName?.trim() || "Vangare Sponsored",
        badge: badge?.trim() || "SPONSORED",
        placement: placement || "BOTH",
        priority: Number(priority) || 0,
        status: status || "ACTIVE",
        listingId: listingId?.trim() || null,
        startsAt: startsAt ? new Date(startsAt) : new Date(),
        endsAt: endsAt ? new Date(endsAt) : null
      }
    });

    return NextResponse.json({ success: true, ad: newAd }, { status: 201 });
  } catch (error) {
    console.error("Error creating ad:", error);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
