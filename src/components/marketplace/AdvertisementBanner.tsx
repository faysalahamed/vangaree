"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ExternalLink, X, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export interface AdvertisementData {
  id: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  targetUrl: string | null;
  sponsorName: string | null;
  badge: string | null;
  placement: string;
  priority: number;
  status: string;
  listing?: {
    id: string;
    phoneBrand: string;
    phoneModel: string;
    partType: string;
    price: number | null;
    photos: { url: string }[];
  } | null;
}

interface AdvertisementBannerProps {
  placement?: "HOME" | "TOP_SEARCH" | "BOTH";
  variant?: "home" | "top_search";
  initialAd?: AdvertisementData | null;
}

export default function AdvertisementBanner({
  placement = "HOME",
  variant = "home",
  initialAd = null
}: AdvertisementBannerProps) {
  const { language } = useLanguage();
  const [ad, setAd] = useState<AdvertisementData | null>(initialAd);
  const [loading, setLoading] = useState(!initialAd);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!initialAd) {
      async function loadAd() {
        try {
          const res = await fetch(`/api/ads?placement=${placement}`);
          if (res.ok) {
            const data = await res.json();
            if (data.ads && data.ads.length > 0) {
              setAd(data.ads[0]);
            }
          }
        } catch (err) {
          console.error("Failed to load advertisement banner:", err);
        } finally {
          setLoading(false);
        }
      }
      loadAd();
    }
  }, [placement, initialAd]);

  if (dismissed || loading || !ad) {
    return null;
  }

  // Determine display values (custom or listing derived)
  const title =
    ad.title ||
    (ad.listing
      ? `${ad.listing.phoneBrand} ${ad.listing.phoneModel} - ${ad.listing.partType}`
      : "Verified Electronics & Parts Special");

  const description =
    ad.description ||
    (ad.listing
      ? `Original tested parts from ${ad.listing.phoneBrand} ${ad.listing.phoneModel}. Verified deal.`
      : "Find verified donor spare parts or connect with certified technicians.");

  const imageUrl =
    ad.imageUrl ||
    ad.listing?.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop";

  const targetUrl = ad.targetUrl || (ad.listing ? `/listings/${ad.listing.id}` : "/listings");
  const sponsorName = ad.sponsorName || "Vangare Partner";
  const badge = ad.badge || (language === "bn" ? "স্পন্সর বিজ্ঞাপন" : "SPONSORED");

  // =========================================================================
  // VARIANT 1: TOP OF SEARCH (Compact & Pinned above results)
  // =========================================================================
  if (variant === "top_search") {
    return (
      <div className="w-full mb-4 bg-white border border-[#cbe2f8] rounded-2xl shadow-xs overflow-hidden transition-all hover:border-sky-400">
        
        {/* Ribbon Header matching Default Design */}
        <div className="bg-[#eaf4fe] px-4 py-2 border-b border-[#cbe2f8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0284c7] text-white font-extrabold text-[10px] tracking-wide uppercase shadow-xs">
              <Sparkles className="h-3 w-3" />
              <span>{badge}</span>
            </span>
            <span className="text-slate-500 font-semibold text-[11px] hidden sm:inline">
              • {sponsorName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
              {language === "bn" ? "টপ সার্চ প্রমোশন" : "Top Search Featured"}
            </span>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss Ad"
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-md hover:bg-white/60 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-32 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 130px"
            />
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-1 hover:text-[#0284c7] transition-colors">
              {title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href={targetUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm"
            >
              <span>{language === "bn" ? "বিজ্ঞাপন দেখুন" : "Explore Offer"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // =========================================================================
  // VARIANT 2: HOME PAGE (Promotional Showcase Banner)
  // =========================================================================
  return (
    <div className="w-full bg-white border border-[#cbe2f8] rounded-3xl shadow-sm overflow-hidden transition-all hover:border-sky-400 hover:shadow-md">
      
      {/* Top Banner Ribbon */}
      <div className="bg-[#eaf4fe] px-5 py-2.5 border-b border-[#cbe2f8] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0284c7] text-white font-extrabold text-[11px] tracking-wide uppercase shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{badge}</span>
          </span>
          <span className="text-[#0369a1] font-bold text-xs flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            <span>{sponsorName}</span>
          </span>
        </div>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss Ad"
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-white transition-colors"
          title={language === "bn" ? "বিজ্ঞাপন বন্ধ করুন" : "Dismiss ad"}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Banner Content Grid */}
      <div className="p-5 sm:p-7 flex flex-col md:flex-row items-center gap-6">
        
        {/* Banner Image */}
        <div className="relative w-full md:w-64 h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80 shadow-xs group">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 260px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Text & Action */}
        <div className="flex-1 flex flex-col justify-between text-center md:text-left">
          <div>
            <div className="inline-block text-[11px] font-extrabold text-[#0284c7] uppercase tracking-wider mb-1">
              {language === "bn" ? "হোম পেজ বিশেষ বিজ্ঞাপন" : "Featured Marketplace Sponsor"}
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <Link
              href={targetUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-sky-600/20 active:scale-95"
            >
              <span>{language === "bn" ? "বিজ্ঞাপন বিস্তারিত দেখুন" : "View Advertisement"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/post-ad"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#cbd5e1] hover:border-sky-400 text-slate-700 hover:text-[#0284c7] text-xs font-bold transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{language === "bn" ? "এখানে বিজ্ঞাপন দিন" : "Advertise Here"}</span>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
