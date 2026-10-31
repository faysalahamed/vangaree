import Link from "next/link";
import Image from "next/image";

type ListingCardProps = {
  id: string;
  listingType: "BUY" | "SELL" | "REPAIR_OFFER" | "REPAIR_REQUEST";
  phoneBrand: string;
  phoneModel: string;
  partType: string;
  condition: string;
  price: number | string | null;
  location: string;
  photoUrl?: string;
};

const TYPE_LABEL: Record<string, string> = {
  SELL: "For Sale",
  BUY: "Looking to Buy",
  REPAIR_OFFER: "Repair Service",
  REPAIR_REQUEST: "Needs Repair"
};

const TYPE_STYLE: Record<string, string> = {
  SELL: "bg-emerald-50 text-emerald-700",
  BUY: "bg-sky-50 text-secondary",
  REPAIR_OFFER: "bg-emerald-50 text-emerald-700",
  REPAIR_REQUEST: "bg-sky-50 text-secondary"
};

export default function ListingCard({
  id,
  listingType,
  phoneBrand,
  phoneModel,
  partType,
  condition,
  price,
  location,
  photoUrl
}: ListingCardProps) {
  return (
    <Link
      href={`/listings/${id}`}
      className="bg-white border border-line rounded-xl p-4 flex flex-col gap-2 hover:border-secondary transition-colors"
    >
      <div className="h-32 bg-line rounded-lg flex items-center justify-center text-slate-400 text-xs overflow-hidden relative">
        {photoUrl ? (
          <Image src={photoUrl} alt={`${phoneBrand} ${phoneModel} ${partType}`} fill className="object-cover" />
        ) : (
          "Photo"
        )}
      </div>
      <span className={`inline-block w-fit text-xs font-semibold rounded px-2 py-0.5 ${TYPE_STYLE[listingType]}`}>
        {TYPE_LABEL[listingType]}
      </span>
      <strong className="text-sm">
        {phoneBrand} {phoneModel} {partType}
      </strong>
      <span className="text-xs text-slate-500">{condition.replace("_", " ")}</span>
      {price != null && <span className="font-bold text-primary">৳ {price}</span>}
      <span className="text-xs text-slate-400">{location}</span>
    </Link>
  );
}
