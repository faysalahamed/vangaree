import { prisma } from "@/lib/prisma";
import CategoryStrip from "@/components/CategoryStrip";
import HeroSlider from "@/components/marketplace/HeroSlider";
import ListingSection from "@/components/marketplace/ListingSection";
import ComingSoonSection from "@/components/marketplace/ComingSoonSection";
import HowItWorks from "@/components/marketplace/HowItWorks";
import TrustSafety from "@/components/marketplace/TrustSafety";

async function fetchByType(type?: string, take = 4) {
  const listings = await prisma.listing.findMany({
    where: { status: "ACTIVE", ...(type ? { listingType: type as never } : {}) },
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
    photoUrl: l.photos[0]?.url
  }));
}

export default async function HomePage() {
  const [latest, spareParts, repairProviders] = await Promise.all([
    fetchByType(undefined, 8),
    fetchByType("SELL", 4),
    fetchByType("REPAIR_OFFER", 4)
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="text-center px-4 py-16 md:py-20 bg-gradient-to-b from-primary-50 to-white">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary max-w-2xl mx-auto mb-3">
          Don&apos;t Throw It Away. Find Its Match.
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Vangare connects people with damaged devices to people with the exact working part they
          need — exchange, sell, or find a repair technician near you.
        </p>
      </section>

      <HeroSlider />

      <CategoryStrip />

      <ListingSection title="Latest Listings" listings={latest} emptyLabel="No listings yet — be the first to post one." />

      <ComingSoonSection
        title="Recently Added Damaged Devices"
        description="A dedicated feed of damaged-device listings opens up once the Phase 2 schema (device models + component conditions) lands — see Documentation section 15."
      />

      <ListingSection
        title="Available Spare Parts"
        listings={spareParts}
        emptyLabel="No spare parts listed yet."
      />

      <ComingSoonSection
        title="Potential Matches"
        description="Personalized reciprocal matches — e.g. your damaged display matched against someone else's damaged battery on the same model — appear here once you're logged in and the scored matching engine (Phase 6) is live."
      />

      <ComingSoonSection
        title="Nearby Listings"
        description="Distance-based sorting opens up once the Bangladesh location hierarchy (Division / District / Upazila / Area) is in place — see Documentation section 15.5, the Location model."
      />

      <ComingSoonSection
        title="Popular Mobile Brands"
        description="Browsing by Samsung, Apple, Xiaomi and other brands as their own filterable pages opens up once the Brand/DeviceModel master data (Phase 2) is seeded."
      />

      <ListingSection
        title="Repair Service Providers"
        listings={repairProviders}
        emptyLabel="No repair services listed yet."
      />

      <HowItWorks />
      <TrustSafety />
    </div>
  );
}
