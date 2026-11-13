import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  MonitorSmartphone, 
  BatteryCharging, 
  Cpu, 
  Camera, 
  Wrench, 
  Smartphone, 
  Layers, 
  ArrowUpRight 
} from "lucide-react";

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

const TYPE_CONFIG = {
  SELL: {
    label: "Available to Buy",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotBg: "bg-emerald-500"
  },
  BUY: {
    label: "Looking to Buy",
    badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
    dotBg: "bg-sky-500"
  },
  REPAIR_OFFER: {
    label: "Repair Service",
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotBg: "bg-indigo-500"
  },
  REPAIR_REQUEST: {
    label: "Needs Repair",
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
    dotBg: "bg-amber-500"
  }
};

const CONDITION_LABELS: Record<string, string> = {
  NEW: "Brand New",
  USED_GOOD: "Original • Good",
  USED_FAIR: "Working • Fair",
  FOR_PARTS: "For Salvage / Parts"
};

function getPartIcon(partType: string) {
  const p = partType.toLowerCase();
  if (p.includes("display") || p.includes("screen")) return MonitorSmartphone;
  if (p.includes("battery")) return BatteryCharging;
  if (p.includes("motherboard") || p.includes("board") || p.includes("cpu")) return Cpu;
  if (p.includes("camera")) return Camera;
  if (p.includes("repair")) return Wrench;
  return Smartphone;
}

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
  const config = TYPE_CONFIG[listingType] || TYPE_CONFIG.SELL;
  const PartIcon = getPartIcon(partType);
  const conditionText = CONDITION_LABELS[condition] || condition.replace("_", " ");

  return (
    <Link href={`/listings/${id}`} className="group block h-full">
      <div className="relative flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden hover:shadow-xl hover:border-secondary-400 hover:-translate-y-1 transition-all duration-300">
        
        {/* Photo Container */}
        <div className="relative h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200/60 overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${phoneBrand} ${phoneModel} ${partType}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          ) : (
            /* Branded Blueprint Tech Graphic Placeholder */
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900 text-white select-none">
              <div 
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                  backgroundSize: "16px 16px"
                }}
              />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 mb-2 group-hover:scale-110 transition-transform duration-300">
                  <PartIcon className="h-6 w-6 text-highlight" />
                </div>
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  {phoneBrand}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {phoneModel}
                </span>
                <span className="text-[10px] text-white/70 font-medium mt-0.5">
                  {partType}
                </span>
              </div>
            </div>
          )}

          {/* Type Badge Floating on Photo */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-sm border ${config.badgeBg}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${config.dotBg}`} />
              {config.label}
            </span>
          </div>

          {/* Quick Corner Arrow Icon on Hover */}
          <div className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-full bg-white/90 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-col flex-1 p-4 justify-between">
          <div>
            {/* Brand & Part Category */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold text-secondary-600">{phoneBrand}</span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-medium text-slate-600">
                {conditionText}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {phoneModel} • {partType}
            </h3>
          </div>

          {/* Bottom Bar: Price & Location */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              {price != null && Number(price) > 0 ? (
                <div className="flex items-baseline gap-0.5">
                  <span className="text-xs font-bold text-primary">৳</span>
                  <span className="text-base font-extrabold text-primary tracking-tight">
                    {Number(price).toLocaleString("en-BD")}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Exchange / Inquire
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
