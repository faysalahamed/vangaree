import Link from "next/link";
import { ArrowRight, PackageOpen, Plus } from "lucide-react";
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
  subtitle,
  listings,
  emptyLabel,
  viewAllHref = "/listings",
  badgeText
}: {
  title: string;
  subtitle?: string;
  listings: ListingLite[];
  emptyLabel: string;
  viewAllHref?: string;
  badgeText?: string;
}) {
  return (
    <section className="px-4 md:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            {badgeText && (
              <span className="inline-block text-xs font-bold text-secondary-600 uppercase tracking-wider mb-1">
                {badgeText}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-secondary-600 hover:text-secondary-800 transition-colors shrink-0"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Listings Grid or Empty State */}
        {listings.length === 0 ? (
          <div className="p-12 rounded-3xl border border-dashed border-slate-300 bg-slate-50/70 text-center flex flex-col items-center justify-center">
            <div className="p-3.5 rounded-2xl bg-white shadow-sm text-slate-400 mb-3">
              <PackageOpen className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-slate-600 max-w-sm mb-4">
              {emptyLabel}
            </p>
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Post an Ad Here
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {listings.map((l) => (
              <ListingCard key={l.id} {...l} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
