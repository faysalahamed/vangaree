import { prisma } from "@/lib/prisma";
import SearchBarBanner from "@/components/marketplace/SearchBarBanner";
import HeroSlider from "@/components/marketplace/HeroSlider";
import AdvertisementBanner from "@/components/marketplace/AdvertisementBanner";
import TrendingAdsFeed from "@/components/marketplace/TrendingAdsFeed";
import MatchmakerStory from "@/components/marketplace/MatchmakerStory";
import HowItWorks from "@/components/marketplace/HowItWorks";
import TrustSafety from "@/components/marketplace/TrustSafety";

async function fetchTrendingListings(take = 12) {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
      take
    });
    return listings.map((l: (typeof listings)[number]) => ({
      id: l.id,
      listingType: l.listingType,
      phoneBrand: l.phoneBrand,
      phoneModel: l.phoneModel,
      partType: l.partType,
      condition: l.condition,
      price: l.price?.toString() ?? null,
      location: l.location,
      photoUrl: l.photos[0]?.url,
      description: l.description
    }));
  } catch (error) {
    console.error("Error fetching listings for home page:", error);
    return [];
  }
}

export default async function HomePage() {
  const trendingListings = await fetchTrendingListings(12);

  return (
    <div className="bg-[#ddf1fd] min-h-screen">
      
      {/* 1. Sky Blue Top Search Banner */}
      <SearchBarBanner />

      {/* 2. Dynamic Image Slider (Configurable in HeroSlider.tsx) */}
      <HeroSlider />

      {/* 2.5. Featured Advertisement Banner (Home Page Showcase) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-4">
        <AdvertisementBanner placement="HOME" variant="home" />
      </section>

      {/* 3. Need-Based Hardware Exchange Feed (Full Width, Category Sidebar Removed) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TrendingAdsFeed listings={trendingListings} />
      </section>

      {/* 4. The Vangare Parts Matchmaker: Broken Display ↔ Dead Battery */}
      <div className="mt-8">
        <MatchmakerStory />
      </div>

      {/* 5. 4-Step Process: How It Works */}
      <HowItWorks />

      {/* 6. Hardware Verification & Safe Trading */}
      <TrustSafety />

    </div>
  );
}
