import { prisma } from "@/lib/prisma";
import SearchFilters from "@/components/marketplace/SearchFilters";
import ListingsResultsView from "@/components/marketplace/ListingsResultsView";
import ListingsInitialEmptyState from "@/components/marketplace/ListingsInitialEmptyState";
import ListingsPageHeader from "@/components/marketplace/ListingsPageHeader";
import AdvertisementBanner from "@/components/marketplace/AdvertisementBanner";
import SearchLogger from "@/components/SearchLogger";
import { ListingItem } from "@/components/marketplace/ClassifiedListingCard";

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

  // Determine if user has performed an active search/filter
  const hasSearched = Boolean(
    q?.trim() ||
    partType?.trim() ||
    brand?.trim() ||
    type?.trim() ||
    condition?.trim() ||
    location?.trim() ||
    minPrice?.trim() ||
    maxPrice?.trim()
  );

  let listings: ListingItem[] = [];

  // ONLY query database if user has searched! Default shows NO ads.
  if (hasSearched) {
    const orderBy =
      sort === "oldest" ? ({ createdAt: "asc" } as const) :
      sort === "price_asc" ? ({ price: "asc" } as const) :
      sort === "price_desc" ? ({ price: "desc" } as const) :
      ({ createdAt: "desc" } as const);

    const records = await prisma.listing.findMany({
      where: {
        status: "ACTIVE",
        ...(partType && { partType: { contains: partType, mode: "insensitive" } }),
        ...(brand && { phoneBrand: { contains: brand, mode: "insensitive" } }),
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
            { phoneBrand: { contains: q, mode: "insensitive" } },
            { partType: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } }
          ]
        })
      },
      include: { photos: { take: 1, orderBy: { sortOrder: "asc" } } },
      orderBy,
      take: 60
    });

    listings = records.map((l: (typeof records)[number]) => ({
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
  }

  return (
    <div className="bg-[#ddf1fd] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Bilingual Page Header */}
        <ListingsPageHeader />

        {/* Senior Designer Search & Filter Center */}
        <SearchFilters 
          defaults={{ q, partType, brand, type, condition, location, minPrice, maxPrice, sort }} 
        />

        {/* Top of Search Sponsored Advertisement */}
        <div className="mt-6 mb-2">
          <AdvertisementBanner placement="TOP_SEARCH" variant="top_search" />
        </div>

        {/* Content Area */}
        {hasSearched && (
          <SearchLogger
            searchQuery={q}
            partType={partType}
            phoneBrand={brand}
            location={location}
          />
        )}
        {!hasSearched ? (
          /* By default: Show NO ads. Show user-friendly search guidance & suggestions */
          <ListingsInitialEmptyState />
        ) : (
          /* After search: Display results in the homepage trendy product classified design */
          <ListingsResultsView 
            listings={listings} 
            resultCount={listings.length}
            activeQuery={q || partType || brand}
          />
        )}

      </div>
    </div>
  );
}
