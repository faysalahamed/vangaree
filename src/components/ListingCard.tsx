import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const TYPE_VARIANT: Record<string, "success" | "info"> = {
  SELL: "success",
  BUY: "info",
  REPAIR_OFFER: "success",
  REPAIR_REQUEST: "info"
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
    <Link href={`/listings/${id}`}>
      <Card className="h-full overflow-hidden hover:border-secondary transition-colors">
        <div className="h-32 bg-neutral-100 relative flex items-center justify-center text-neutral-400 text-xs">
          {photoUrl ? (
            <Image src={photoUrl} alt={`${phoneBrand} ${phoneModel} ${partType}`} fill className="object-cover" />
          ) : (
            "Photo"
          )}
        </div>
        <CardContent className="pt-3 flex flex-col gap-1.5">
          <Badge variant={TYPE_VARIANT[listingType]} className="w-fit">
            {TYPE_LABEL[listingType]}
          </Badge>
          <strong className="text-sm text-primary-800 leading-snug">
            {phoneBrand} {phoneModel} {partType}
          </strong>
          <span className="text-xs text-neutral-500">{condition.replace("_", " ")}</span>
          {price != null && <span className="font-bold text-primary">৳ {price}</span>}
          <span className="flex items-center gap-1 text-xs text-neutral-400">
            <MapPin className="h-3 w-3" /> {location}
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
