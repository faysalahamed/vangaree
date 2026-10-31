import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CategoryStrip from "@/components/CategoryStrip";
import ListingCard from "@/components/ListingCard";

export default async function HomePage() {
  const recent = await prisma.listing.findMany({
    where: { status: "ACTIVE" },
    include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 8
  });

  return (
    <div>
      <section className="text-center px-6 py-16 md:py-20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary max-w-2xl mx-auto mb-3">
          Connecting Users for Gadget Exchange &amp; Repair
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto mb-8">
          Buy or sell working device parts, or find a trusted local repair technician — all in one place.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/listings?type=BUY" className="bg-secondary text-white rounded-lg px-7 py-4 font-semibold">
            Buy a Part
          </Link>
          <Link href="/listings?type=SELL" className="bg-accent text-white rounded-lg px-7 py-4 font-semibold">
            Sell a Part
          </Link>
          <Link href="/listings?type=REPAIR_OFFER" className="bg-primary text-white rounded-lg px-7 py-4 font-semibold">
            Find a Repair Technician
          </Link>
        </div>
      </section>

      <CategoryStrip />

      <section className="px-6 md:px-12 pb-16">
        <h2 className="text-lg font-semibold text-primary mb-4">Recent Listings</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400">No listings yet — be the first to post one.</p>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            {recent.map((l) => (
              <ListingCard
                key={l.id}
                id={l.id}
                listingType={l.listingType}
                phoneBrand={l.phoneBrand}
                phoneModel={l.phoneModel}
                partType={l.partType}
                condition={l.condition}
                price={l.price?.toString() ?? null}
                location={l.location}
                photoUrl={l.photos[0]?.url}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
