import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function detectDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

// POST /api/events — log a view/search/filter event with location & device info
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string } | undefined)?.id ?? null;

    const body = await req.json();
    const {
      sessionId,
      eventType,
      listingId,
      partType,
      phoneBrand,
      searchQuery,
      location,
      pageUrl,
      timezone
    } = body;

    if (!sessionId || !eventType) {
      return NextResponse.json({ error: "sessionId and eventType are required" }, { status: 400 });
    }

    // Extract IP, Geo headers, and User-Agent from request headers
    const headers = req.headers;
    const forwardedFor = headers.get("x-forwarded-for");
    const realIp = headers.get("x-real-ip");
    const rawIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";
    const ipAddress = rawIp === "::1" ? "127.0.0.1" : rawIp;

    const userAgent = headers.get("user-agent") || "Unknown";
    const deviceType = detectDevice(userAgent);

    // Cloud/Proxy Geo Headers (Vercel, Cloudflare, etc.)
    let city = headers.get("x-vercel-ip-city") || headers.get("cf-ipcity") || null;
    let country = headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || null;

    // Decode URI-encoded city names if provided by proxy
    if (city) {
      try {
        city = decodeURIComponent(city);
      } catch {
        // ignore decode error
      }
    }

    // Fallback: use client timezone (e.g., Asia/Dhaka) if running locally or behind no geo proxy
    if (!city && timezone) {
      if (timezone === "Asia/Dhaka") {
        city = "Dhaka (TZ)";
        country = country || "BD";
      } else {
        city = timezone;
      }
    }

    const event = await prisma.userEvent.create({
      data: {
        userId,
        sessionId,
        eventType,
        listingId: listingId || null,
        partType: partType || null,
        phoneBrand: phoneBrand || null,
        searchQuery: searchQuery?.trim() || null,
        location: location?.trim() || null,
        ipAddress,
        city,
        country,
        deviceType,
        userAgent: userAgent.slice(0, 250),
        pageUrl: pageUrl || null
      }
    });

    return NextResponse.json({ id: event.id }, { status: 201 });
  } catch (error) {
    console.error("Error logging event:", error);
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 });
  }
}
