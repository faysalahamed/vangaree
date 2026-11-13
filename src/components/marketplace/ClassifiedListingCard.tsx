"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Smartphone, 
  Cpu, 
  MonitorSmartphone, 
  BatteryCharging, 
  Camera, 
  Wrench 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export type ListingItem = {
  id: string;
  listingType: "BUY" | "SELL" | "REPAIR_OFFER" | "REPAIR_REQUEST";
  phoneBrand: string;
  phoneModel: string;
  partType: string;
  condition: string;
  price: string | number | null;
  location: string;
  photoUrl?: string;
  description?: string;
};

const TYPE_CONFIG = {
  SELL: {
    label_en: "For Sale",
    label_bn: "বিক্রয়",
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  BUY: {
    label_en: "Looking to Buy",
    label_bn: "ক্রয় করতে ইচ্ছুক",
    bg: "bg-sky-50 text-sky-700 border-sky-200"
  },
  REPAIR_OFFER: {
    label_en: "Repair Offer",
    label_bn: "মেরামত সেবা",
    bg: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  REPAIR_REQUEST: {
    label_en: "Needs Repair",
    label_bn: "মেরামত প্রয়োজন",
    bg: "bg-amber-50 text-amber-700 border-amber-200"
  }
};

const CONDITION_MAP = {
  NEW: { en: "Brand New", bn: "নতুন" },
  USED_GOOD: { en: "Used", bn: "ব্যবহৃত" },
  USED_FAIR: { en: "Used - Fair", bn: "ব্যবহৃত (চলনসই)" },
  FOR_PARTS: { en: "For Parts Only", bn: "পার্টসের জন্য" }
};

function getPlaceholderIcon(partType: string) {
  const p = partType.toLowerCase();
  if (p.includes("display") || p.includes("screen")) return MonitorSmartphone;
  if (p.includes("battery")) return BatteryCharging;
  if (p.includes("motherboard") || p.includes("board")) return Cpu;
  if (p.includes("camera")) return Camera;
  if (p.includes("repair")) return Wrench;
  return Smartphone;
}

export default function ClassifiedListingCard({
  listing,
  viewMode = "list"
}: {
  listing: ListingItem;
  viewMode?: "list" | "grid";
}) {
  const { language, t } = useLanguage();
  const config = TYPE_CONFIG[listing.listingType] || TYPE_CONFIG.SELL;
  const typeLabel = language === "bn" ? config.label_bn : config.label_en;
  
  const condEntry = CONDITION_MAP[listing.condition as keyof typeof CONDITION_MAP];
  const cond = condEntry ? (language === "bn" ? condEntry.bn : condEntry.en) : listing.condition;
  const PartIcon = getPlaceholderIcon(listing.partType);

  if (viewMode === "grid") {
    return (
      <Link
        href={`/listings/${listing.id}`}
        className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-400 hover:shadow-md transition-all overflow-hidden"
      >
        <div className="relative h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
          {listing.photoUrl ? (
            <Image
              src={listing.photoUrl}
              alt={`${listing.phoneBrand} ${listing.phoneModel}`}
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-900 to-sky-950 text-white">
              <PartIcon className="h-6 w-6 text-sky-400 mb-1" />
              <span className="text-[10px] font-bold text-slate-300">{listing.phoneBrand}</span>
              <span className="text-xs font-extrabold text-white line-clamp-1">{listing.phoneModel}</span>
            </div>
          )}
          <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm ${config.bg}`}>
            {typeLabel}
          </span>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-sky-700">{listing.phoneBrand}</span>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 line-clamp-1 mb-1">
              {listing.phoneModel} • {listing.partType}
            </h3>
            <span className="text-[11px] text-slate-500 block mb-2">{cond}</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-black text-sky-600">
              {listing.price != null && Number(listing.price) > 0 ? `BDT ${Number(listing.price).toLocaleString("en-BD")}` : t("swap_inquire")}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin className="h-3 w-3" /> {listing.location}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-sky-400 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Photo Column on Left */}
      <div className="relative w-full sm:w-52 h-40 shrink-0 bg-slate-100 overflow-hidden flex items-center justify-center">
        {listing.photoUrl ? (
          <Image
            src={listing.photoUrl}
            alt={`${listing.phoneBrand} ${listing.phoneModel}`}
            fill
            sizes="(max-width: 640px) 100vw, 220px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-900 to-sky-950 text-white">
            <PartIcon className="h-6 w-6 text-sky-400 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {listing.phoneBrand}
            </span>
            <span className="text-xs font-extrabold text-white text-center line-clamp-1">
              {listing.phoneModel}
            </span>
          </div>
        )}

        {/* Type Badge Floating on Photo */}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-sm backdrop-blur-sm ${config.bg}`}>
          {typeLabel}
        </span>
      </div>

      {/* Information Column on Right */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1.5">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
              {listing.phoneBrand} {listing.phoneModel} • {listing.partType}
            </h3>
            
            {/* Price on top-right */}
            <div className="shrink-0 text-left sm:text-right">
              {listing.price != null && Number(listing.price) > 0 ? (
                <span className="text-sm sm:text-base font-black text-sky-600 tracking-tight">
                  BDT {Number(listing.price).toLocaleString("en-BD")}
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
                  {t("swap_inquire")}
                </span>
              )}
            </div>
          </div>

          {/* Description Snippet */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
            {listing.description || `Original working ${listing.partType} from donor ${listing.phoneBrand} ${listing.phoneModel}. Contact for physical inspection or verified exchange.`}
          </p>
        </div>

        {/* Bottom Row: Condition Badge & Location */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
            {cond}
          </span>

          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{listing.location}</span>
          </div>
        </div>

      </div>
    </Link>
  );
}
