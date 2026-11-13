"use client";

import { useState } from "react";
import Link from "next/link";
import { Grid, List, PackageOpen, Plus } from "lucide-react";
import ClassifiedListingCard, { ListingItem } from "@/components/marketplace/ClassifiedListingCard";
import { useLanguage } from "@/context/LanguageContext";

export default function ListingsResultsView({
  listings,
  resultCount,
  activeQuery
}: {
  listings: ListingItem[];
  resultCount: number;
  activeQuery?: string;
}) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { language, t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      
      {/* Results Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {activeQuery ? `${t("listings_results_for")} "${activeQuery}"` : t("listings_matched_title")}
          </h2>
          <p className="text-xs text-slate-500">
            {resultCount} {t("listings_found_count")}
          </p>
        </div>

        {/* View Switcher: List vs Grid */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-sky-50 text-sky-600 shadow-sm"
                : "text-slate-400 hover:text-slate-800"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-sky-50 text-sky-600 shadow-sm"
                : "text-slate-400 hover:text-slate-800"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* No Results Found State */}
      {listings.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl border border-dashed border-slate-300 bg-white text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-4 rounded-2xl bg-sky-50 text-sky-600 mb-3">
            <PackageOpen className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {t("listings_no_results_title")}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            {t("listings_no_results_sub")}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/post-ad"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              {t("listings_post_request_btn")}
            </Link>
            <Link
              href="/listings"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
            >
              {t("listings_clear_filters_btn")}
            </Link>
          </div>
        </div>
      ) : viewMode === "list" ? (
        /* List View (Matching Homepage Trendy Product Design) */
        <div className="flex flex-col gap-3.5">
          {listings.map((item) => (
            <ClassifiedListingCard key={item.id} listing={item} viewMode="list" />
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((item) => (
            <ClassifiedListingCard key={item.id} listing={item} viewMode="grid" />
          ))}
        </div>
      )}

    </div>
  );
}
