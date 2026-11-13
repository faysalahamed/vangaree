"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  defaults: {
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
};

const POPULAR_BRANDS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Google",
  "OnePlus",
  "Vivo",
  "Oppo",
  "Realme",
  "HP",
  "Dell",
  "Lenovo",
  "Asus",
  "Sony"
];

const PART_TYPES = [
  { en: "Display / Screen", bn: "ডিসপ্লে / স্ক্রিন" },
  { en: "Battery", bn: "ব্যাটারি" },
  { en: "Motherboard", bn: "মাদারবোর্ড / লজিক বোর্ড" },
  { en: "Camera Module", bn: "ক্যামেরা মডিউল" },
  { en: "Charging Port", bn: "চার্জিং পোর্ট" },
  { en: "Speaker & Mic", bn: "স্পিকার ও মাইক" },
  { en: "Housing & Back Glass", bn: "বডি ও ব্যাক গ্লাস" },
  { en: "Full Donor Device", bn: "পার্টসের জন্য ডেড ফোন" }
];

const DIVISIONS = [
  "All Bangladesh",
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh"
];

const DIVISIONS_BN: Record<string, string> = {
  "All Bangladesh": "সমগ্র বাংলাদেশ",
  "Dhaka": "ঢাকা",
  "Chattogram": "চট্টগ্রাম",
  "Khulna": "খুলনা",
  "Rajshahi": "রাজশাহী",
  "Sylhet": "সিলেট",
  "Barishal": "বরিশাল",
  "Rangpur": "রংপুর",
  "Mymensingh": "ময়মনসিংহ"
};

export default function SearchFilters({ defaults }: Props) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(defaults.condition || defaults.minPrice || defaults.maxPrice || defaults.sort)
  );

  const hasActiveFilters = Boolean(
    defaults.q ||
    defaults.brand ||
    defaults.partType ||
    defaults.type ||
    defaults.condition ||
    defaults.location ||
    defaults.minPrice ||
    defaults.maxPrice
  );

  const handleReset = () => {
    router.push("/listings");
  };

  const LISTING_TYPES = [
    { value: "", label: language === "bn" ? "সকল ধরনের বিজ্ঞাপন" : "All Intent Types" },
    { value: "SELL", label: language === "bn" ? "বিক্রয় / ডোনার পার্টস" : "For Sale / Salvage" },
    { value: "BUY", label: language === "bn" ? "ক্রয় করতে ইচ্ছুক" : "Looking to Buy" },
    { value: "REPAIR_OFFER", label: language === "bn" ? "মেরামত সেবা" : "Repair Services" },
    { value: "REPAIR_REQUEST", label: language === "bn" ? "মেরামত প্রয়োজন" : "Needs Repair" }
  ];

  const CONDITIONS = [
    { value: "", label: t("filter_any_condition") },
    { value: "NEW", label: t("cond_new") },
    { value: "USED_GOOD", label: t("cond_used") },
    { value: "USED_FAIR", label: t("cond_fair") },
    { value: "FOR_PARTS", label: t("cond_parts") }
  ];

  const SORTS = [
    { value: "latest", label: t("filter_sort_latest") },
    { value: "price_asc", label: t("filter_sort_price_asc") },
    { value: "price_desc", label: t("filter_sort_price_desc") },
    { value: "oldest", label: t("filter_sort_oldest") }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-6 mb-8">
      <form action="/listings" method="GET" className="flex flex-col gap-4">
        
        {/* ROW 1: Primary Search Bar & Location */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          
          {/* Main Keyword Input */}
          <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1.5 focus-within:border-sky-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-100 transition-all">
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
            <input
              id="q"
              name="q"
              defaultValue={defaults.q}
              placeholder={t("filter_input_placeholder")}
              className="w-full bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none py-2"
            />
          </div>

          {/* Location Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 sm:w-48 shrink-0">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <select
              id="location"
              name="location"
              defaultValue={defaults.location ?? ""}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-700 outline-none cursor-pointer"
            >
              <option value="">{t("banner_location_all")}</option>
              {DIVISIONS.filter(d => d !== "All Bangladesh").map((div) => (
                <option key={div} value={div}>
                  {language === "bn" ? DIVISIONS_BN[div] || div : div}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Submit Button */}
          <button
            type="submit"
            className="px-7 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-600/20 shrink-0"
          >
            <Search className="h-4 w-4" />
            <span>{t("header_search_btn")}</span>
          </button>
        </div>

        {/* ROW 2: Key Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          
          {/* Brand Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {t("filter_brand")}
            </label>
            <select
              id="brand"
              name="brand"
              defaultValue={defaults.brand ?? ""}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              <option value="">{t("filter_any_brand")}</option>
              {POPULAR_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Part Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {t("filter_part")}
            </label>
            <select
              id="partType"
              name="partType"
              defaultValue={defaults.partType ?? ""}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              <option value="">{t("filter_any_part")}</option>
              {PART_TYPES.map((p) => (
                <option key={p.en} value={p.en}>
                  {language === "bn" ? p.bn : p.en}
                </option>
              ))}
            </select>
          </div>

          {/* Listing Intent Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {t("filter_intent")}
            </label>
            <select
              id="type"
              name="type"
              defaultValue={defaults.type ?? ""}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              {LISTING_TYPES.map((tItem) => (
                <option key={tItem.value} value={tItem.value}>
                  {tItem.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {t("filter_sort")}
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={defaults.sort ?? "latest"}
              className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500 focus:bg-white cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Advanced Filters Expandable Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{showAdvanced ? t("filter_hide") : t("filter_more")}</span>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t("filter_reset")}</span>
            </button>
          )}
        </div>

        {/* ROW 3: Advanced Options (Collapsible) */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs bg-slate-50/50 p-3 rounded-2xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t("filter_condition")}
              </label>
              <select
                id="condition"
                name="condition"
                defaultValue={defaults.condition ?? ""}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t("filter_min_price")}
              </label>
              <input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="0"
                defaultValue={defaults.minPrice}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {t("filter_max_price")}
              </label>
              <input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="e.g. 5000"
                defaultValue={defaults.maxPrice}
                className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none focus:border-sky-500"
              />
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
