"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Grid, 
  List, 
  Repeat, 
  Wrench, 
  PackageOpen, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import ClassifiedListingCard, { ListingItem } from "@/components/marketplace/ClassifiedListingCard";
import { useLanguage } from "@/context/LanguageContext";

export default function TrendingAdsFeed({ listings }: { listings: ListingItem[] }) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-5">
      
      {/* Top Action Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/listings"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 hover:border-purple-300 hover:shadow-sm transition-all"
        >
          <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0">
            <Repeat className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-purple-950 truncate">
              {t("pill_matchmaker")}
            </span>
            <span className="block text-[11px] text-purple-600 truncate">
              {t("pill_matchmaker_sub")}
            </span>
          </div>
        </Link>

        <Link
          href="/post-ad"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/80 hover:border-sky-300 hover:shadow-sm transition-all"
        >
          <div className="p-2 rounded-xl bg-sky-100 text-sky-700 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-sky-950 truncate">
              {t("pill_post_ad")}
            </span>
            <span className="block text-[11px] text-sky-600 truncate">
              {t("pill_post_ad_sub")}
            </span>
          </div>
        </Link>

        <Link
          href="/listings?type=REPAIR_OFFER"
          className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-sm transition-all"
        >
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
            <Wrench className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-bold text-emerald-950 truncate">
              {t("pill_technician")}
            </span>
            <span className="block text-[11px] text-emerald-600 truncate">
              {t("pill_technician_sub")}
            </span>
          </div>
        </Link>
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            {t("feed_trending_title")}
          </h2>
          <p className="text-xs text-slate-500">
            {t("feed_trending_sub")}
          </p>
        </div>

        {/* View Switcher (List / Grid) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Listing Content: Empty State or Cards */}
      {listings.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 bg-white text-center flex flex-col items-center justify-center">
          <PackageOpen className="h-8 w-8 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-700 mb-1">{t("feed_no_ads_title")}</h3>
          <p className="text-xs text-slate-400 mb-4">{t("feed_no_ads_sub")}</p>
          <Link
            href="/post-ad"
            className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
          >
            {t("header_post_ad")}
          </Link>
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-3.5">
          {listings.map((l) => (
            <ClassifiedListingCard key={l.id} listing={l} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {listings.map((l) => (
            <ClassifiedListingCard key={l.id} listing={l} viewMode="grid" />
          ))}
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-3">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-sky-600 text-sky-600 hover:bg-sky-50 font-bold text-xs sm:text-sm transition-colors"
        >
          {t("feed_view_all")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}
