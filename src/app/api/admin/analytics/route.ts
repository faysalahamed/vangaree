import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const [
      totalEvents,
      totalSearches,
      totalViews,
      distinctSessions,
      recentSearches,
      recentVisits,
      allSearchEvents,
      allLocationEvents,
      allDeviceEvents
    ] = await Promise.all([
      prisma.userEvent.count(),
      prisma.userEvent.count({ where: { eventType: "SEARCH" } }),
      prisma.userEvent.count({ where: { eventType: "VIEW" } }),
      prisma.userEvent.findMany({
        distinct: ["sessionId"],
        select: { sessionId: true }
      }),
      prisma.userEvent.findMany({
        where: { eventType: "SEARCH" },
        include: {
          user: { select: { name: true, phone: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 30
      }),
      prisma.userEvent.findMany({
        where: { eventType: "VIEW" },
        include: {
          user: { select: { name: true, phone: true } }
        },
        orderBy: { createdAt: "desc" },
        take: 30
      }),
      prisma.userEvent.findMany({
        where: { eventType: "SEARCH" },
        select: { searchQuery: true, partType: true, phoneBrand: true },
        orderBy: { createdAt: "desc" },
        take: 500
      }),
      prisma.userEvent.findMany({
        select: { city: true, country: true, location: true },
        orderBy: { createdAt: "desc" },
        take: 500
      }),
      prisma.userEvent.findMany({
        select: { deviceType: true },
        orderBy: { createdAt: "desc" },
        take: 500
      })
    ]);

    // Aggregate Top Searches
    const searchCounts: Record<string, number> = {};
    for (const s of allSearchEvents) {
      const term = s.searchQuery || s.partType || s.phoneBrand;
      if (term) {
        const key = term.trim();
        searchCounts[key] = (searchCounts[key] || 0) + 1;
      }
    }
    const topSearches = Object.entries(searchCounts)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Aggregate Top Browsing Locations
    const locationCounts: Record<string, number> = {};
    for (const loc of allLocationEvents) {
      const label = loc.city
        ? loc.country
          ? `${loc.city}, ${loc.country}`
          : loc.city
        : loc.location || "Unknown";
      locationCounts[label] = (locationCounts[label] || 0) + 1;
    }
    const topLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Aggregate Device Breakdown
    const deviceCounts: Record<string, number> = {};
    for (const d of allDeviceEvents) {
      const dev = d.deviceType || "Unknown";
      deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;
    }
    const deviceBreakdown = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      summary: {
        totalEvents,
        totalSearches,
        totalViews,
        uniqueVisitors: distinctSessions.length
      },
      topSearches,
      topLocations,
      deviceBreakdown,
      recentSearches,
      recentVisits
    });
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
