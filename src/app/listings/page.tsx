import { prisma } from "@/lib/prisma";
import ListingCard from "@/components/ListingCard";
import SearchFilters from "@/components/marketplace/SearchFilters";

type SearchParams = {
  q?: string;
  partType?: string;
  brand?: string;
  type?: string;
  condition?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
};

export default async function ListingsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, partType, brand, type, condition, location, minPrice, maxPrice, sort } =
    await searchParams;

  const orderBy =
    sort === "oldest" ? ({ createdAt: "asc" } as const) :
    sort === "price_asc" ? ({ price: "asc" } as const) :
    sort === "price_desc" ? ({ price: "desc" } as const) :
    ({ createdAt: "desc" } as const);

  const listings = await prisma.listing.findMany({
    where: {
      status: "ACTIVE",
      ...(partType && { partType }),
      ...(brand && { phoneBrand: brand }),
      ...(type && { listingType: type as never }),
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
    take: 60
  });

  return (
    <div className="px-4 md:px-12 py-10">
      <h1 className="text-xl font-bold text-primary mb-5">
        {q ? `Results for "${q}"` : "Browse Listings"}
      </h1>

      <SearchFilters defaults={{ q, partType, type, condition, location, minPrice, maxPrice, sort }} />

      <p className="text-xs text-neutral-400 mb-4">{listings.length} result{listings.length === 1 ? "" : "s"}</p>

      {listings.length === 0 ? (
        <p className="text-sm text-neutral-400">No listings match these filters yet.</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {listings.map((l: (typeof listings)[number]) => (
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
