import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";

type SearchParams = {
  q?: string;
  partType?: string;
  brand?: string;
  type?: string;
  location?: string;
};

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, partType, brand, type, location } = await searchParams;

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(partType && { partType }),
      ...(brand && { phoneBrand: brand }),
      ...(type && { listingType: type as never }),
      ...(location && { location: { contains: location, mode: "insensitive" } }),
      ...(q && {
        OR: [
          { phoneModel: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } }
        ]
      })
    },
    include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 60
  });

  return (
    <div className="px-6 md:px-12 py-10">
      <h1 className="text-xl font-bold text-primary mb-6">
        {q ? `Results for "${q}"` : "Browse Listings"}
      </h1>

      {listings.length === 0 ? (
        <p className="text-sm text-slate-400">No listings match these filters yet.</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {listings.map((l) => (
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
    </div>
  );
}
