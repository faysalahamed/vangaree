import ListingCard from "@/components/ListingCard";

type ListingLite = {
  id: string;
  listingType: "BUY" | "SELL" | "REPAIR_OFFER" | "REPAIR_REQUEST";
  phoneBrand: string;
  phoneModel: string;
  partType: string;
  condition: string;
  price: string | null;
  location: string;
  photoUrl?: string;
};

export default function ListingSection({
  title,
  listings,
  emptyLabel
}: {
  title: string;
  listings: ListingLite[];
  emptyLabel: string;
}) {
  return (
    <section className="px-4 md:px-12 py-10">
      <h2 className="text-lg font-bold text-primary mb-5">{title}</h2>
      {listings.length === 0 ? (
        <p className="text-sm text-neutral-400">{emptyLabel}</p>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          {listings.map((l) => (
            <ListingCard key={l.id} {...l} />
          ))}
        </div>
      )}
    </section>
  );
}
