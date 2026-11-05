import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ViewLogger from "@/components/ViewLogger";

const TYPE_LABEL: Record<string, string> = {
  SELL: "For Sale",
  BUY: "Looking to Buy",
  REPAIR_OFFER: "Repair Service",
  REPAIR_REQUEST: "Needs Repair"
};

export default async function ListingDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
      user: { select: { id: true, name: true, location: true, createdAt: true, phone: true } }
    }
  });

  if (!listing) notFound();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-[1.4fr_1fr] gap-8">
      <ViewLogger listingId={listing.id} partType={listing.partType} phoneBrand={listing.phoneBrand} />

      <div>
        <div className="h-80 bg-line rounded-xl mb-3 relative overflow-hidden flex items-center justify-center text-slate-400">
          {listing.photos[0] ? (
            <Image src={listing.photos[0].url} alt={listing.phoneModel} fill className="object-cover" />
          ) : (
            "Main Photo"
          )}
        </div>
        <div className="flex gap-2">
          {listing.photos.slice(1, 4).map((p: (typeof listing.photos)[number]) => (
            <div key={p.id} className="w-20 h-20 bg-line rounded-lg relative overflow-hidden">
              <Image src={p.url} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>

        <h2 className="text-base font-semibold text-primary mt-8 mb-2">Description</h2>
        <p className="text-sm leading-relaxed text-slate-600">{listing.description}</p>

        <h2 className="text-base font-semibold text-primary mt-7 mb-2">Details</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><strong>Part:</strong> {listing.partType}</div>
          <div><strong>Model fit:</strong> {listing.phoneBrand} {listing.phoneModel}</div>
          <div><strong>Condition:</strong> {listing.condition.replace("_", " ")}</div>
          <div><strong>Posted:</strong> {listing.createdAt.toLocaleDateString()}</div>
        </div>
      </div>

      <div>
        <div className="bg-white border border-line rounded-xl p-5 sticky top-5">
          <span className="inline-block text-xs font-bold rounded px-2.5 py-1 bg-emerald-50 text-emerald-700">
            {TYPE_LABEL[listing.listingType]}
          </span>
          <h1 className="text-xl font-bold text-primary mt-3 mb-1">
            {listing.phoneBrand} {listing.phoneModel} {listing.partType}
          </h1>
          {listing.price != null && (
            <div className="text-2xl font-extrabold text-primary mb-1">৳ {listing.price.toString()}</div>
          )}
          <div className="text-xs text-slate-400 mb-5">{listing.location}</div>

          <button className="w-full bg-accent text-white rounded-lg py-3.5 text-sm font-bold mb-2.5">
            Reveal Phone Number
          </button>
          <button className="w-full bg-white text-secondary border border-secondary rounded-lg py-3.5 text-sm font-bold">
            Message Seller
          </button>

          <div className="mt-6 pt-4 border-t border-line flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-line" />
            <div>
              <div className="text-sm font-bold">{listing.user.name}</div>
              <div className="text-xs text-slate-400">
                Member since {listing.user.createdAt.getFullYear()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
