"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

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

const POPULAR_SEARCHES_BN = [
  "মোবাইল ডিসপ্লে",
  "ল্যাপটপ মাদারবোর্ড",
  "আইফোন ব্যাটারি",
  "স্যামসাং স্ক্রিন",
  "টিভি পাওয়ার বোর্ড",
  "অডিও অ্যামপ্লিফায়ার",
  "পার্টসের জন্য ডেড ফোন"
];

const POPULAR_SEARCHES_EN = [
  "Mobile Displays",
  "Laptop Motherboards",
  "iPhone Battery",
  "Samsung Screen",
  "Smart TV Boards",
  "Audio Amplifiers",
  "Dead Phones for Parts"
];

export default function SearchBarBanner() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [division, setDivision] = useState("All Bangladesh");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (division && division !== "All Bangladesh") params.set("division", division);
    router.push(`/listings?${params.toString()}`);
  };

  const handleChipClick = (term: string) => {
    router.push(`/listings?q=${encodeURIComponent(term)}`);
  };

  const popularSearches = language === "bn" ? POPULAR_SEARCHES_BN : POPULAR_SEARCHES_EN;

  return (
    <div className="relative bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white pt-10 pb-12 px-4 sm:px-6 shadow-md overflow-hidden">
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Banner Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
          {t("banner_title")}
        </h1>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-2 bg-white/15 p-2 rounded-2xl backdrop-blur-md shadow-2xl border border-white/30 max-w-3xl mx-auto"
        >
          {/* Location Selector */}
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 sm:py-2.5 sm:w-56 shadow-sm border border-slate-200">
            <MapPin className="h-4 w-4 text-sky-600 shrink-0" />
            <select
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none cursor-pointer"
            >
              {DIVISIONS.map((d) => (
                <option key={d} value={d} className="text-slate-800 font-medium">
                  {language === "bn" ? DIVISIONS_BN[d] || d : d}
                </option>
              ))}
            </select>
          </div>

          {/* Search Text Input */}
          <div className="relative flex-1 flex items-center bg-white rounded-xl px-4 py-1.5 shadow-sm border border-slate-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("banner_search_placeholder")}
              className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none pr-9 py-2"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-colors shadow-sm"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-white/80 font-medium mr-1 hidden sm:inline">{t("banner_popular")}</span>
          {popularSearches.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white/95 font-medium backdrop-blur-sm border border-white/20 transition-all text-[11px]"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
