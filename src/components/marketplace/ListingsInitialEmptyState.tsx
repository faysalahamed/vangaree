"use client";

import Link from "next/link";
import { 
  Search, 
  Sparkles, 
  Repeat, 
  ShieldCheck, 
  ArrowRight, 
  Plus
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const SUGGESTIONS_BN = [
  { label: "স্যামসাং A33 ডিসপ্লে", q: "Samsung A33", partType: "Display" },
  { label: "আইফোন 11 ব্যাটারি", q: "iPhone 11", partType: "Battery" },
  { label: "রেডমি নোট 10 বোর্ড", q: "Redmi Note 10", partType: "Motherboard" },
  { label: "স্যামসাং A52 এমোলেড", q: "Samsung A52", partType: "Display" },
  { label: "পার্টসের জন্য ডেড ফোন", condition: "FOR_PARTS" },
  { label: "এইচপি ল্যাপটপ স্ক্রিন", q: "HP" },
  { label: "টেকনিশিয়ান সেবা", type: "REPAIR_OFFER" }
];

const SUGGESTIONS_EN = [
  { label: "Samsung A33 Display", q: "Samsung A33", partType: "Display" },
  { label: "iPhone 11 Battery", q: "iPhone 11", partType: "Battery" },
  { label: "Redmi Note 10 Board", q: "Redmi Note 10", partType: "Motherboard" },
  { label: "Samsung A52 AMOLED", q: "Samsung A52", partType: "Display" },
  { label: "Dead Phones for Parts", condition: "FOR_PARTS" },
  { label: "HP Laptop Screen", q: "HP" },
  { label: "Technician Services", type: "REPAIR_OFFER" }
];

export default function ListingsInitialEmptyState() {
  const { language, t } = useLanguage();
  const suggestions = language === "bn" ? SUGGESTIONS_BN : SUGGESTIONS_EN;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Central Visual Search Prompt Card */}
      <div className="relative rounded-3xl bg-white border border-slate-200/90 shadow-sm p-8 sm:p-12 text-center overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          
          <div className="h-14 w-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center mb-4 shadow-sm">
            <Search className="h-7 w-7" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-3 border border-sky-100">
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            {language === "bn" ? "হার্ডওয়্যার ও স্পেয়ার পার্টস সার্চ" : "Hardware & Salvage Search"}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
            {t("listings_initial_title")}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
            {t("listings_initial_subtitle")}
          </p>

          {/* Quick Suggestions */}
          <div className="w-full pt-4 border-t border-slate-100">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              {t("listings_popular_searches")}
            </span>

            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => {
                const params = new URLSearchParams();
                if (s.q) params.set("q", s.q);
                if (s.partType) params.set("partType", s.partType);
                if (s.condition) params.set("condition", s.condition);
                if (s.type) params.set("type", s.type);

                return (
                  <Link
                    key={s.label}
                    href={`/listings?${params.toString()}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
                  >
                    <Search className="h-3 w-3 text-slate-400" />
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* 3 Pillar Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
            <Repeat className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {language === "bn" ? "পারস্পরিক ম্যাচিং" : "Reciprocal Matching"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === "bn" 
              ? "আপনার ভাঙা স্ক্রিনের বিপরীতে অন্য কারো ডেড মাদারবোর্ডের ভালো স্ক্রিন ম্যাচ করুন।" 
              : "Match your broken screen against someone with a dead motherboard on the same phone."}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">
            {language === "bn" ? "আসল OEM পার্টস" : "Original OEM Parts"}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === "bn"
              ? "বাজারে নকল কপি পার্টস এড়িয়ে ডোনার ডিভাইস থেকে ১০০% আসল ফ্যাক্টরি পার্টস নিন।"
              : "Avoid cheap market replicas. Get 100% authentic factory parts harvested from real donor devices."}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Plus className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {language === "bn" ? "নষ্ট ডিভাইস আছে?" : "Have a Broken Device?"}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              {language === "bn"
                ? "ভালো পার্টসগুলোর তালিকা দিন এবং অপ্রয়োজনীয় ডিভাইস বিক্রি করে টাকা আয় করুন।"
                : "List its working components today and turn old tech into cash."}
            </p>
          </div>
          <Link
            href="/post-ad"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            {t("header_post_ad")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
