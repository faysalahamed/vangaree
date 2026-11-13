"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  Tag as TagIcon, 
  Search, 
  Wrench, 
  Hammer, 
  Smartphone, 
  Cpu, 
  MapPin, 
  ImagePlus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  X,
  LogIn,
  Hash,
  Plus,
  Layers,
  FileText,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

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

const COMMON_PARTS = [
  { en: "Display / Screen", bn: "ডিসপ্লে / স্ক্রিন" },
  { en: "Battery", bn: "ব্যাটারি" },
  { en: "Motherboard", bn: "মাদারবোর্ড / লজিক বোর্ড" },
  { en: "Camera Module", bn: "ক্যামেরা মডিউল" },
  { en: "Charging Port", bn: "চার্জিং পোর্ট" },
  { en: "Speaker & Mic", bn: "স্পিকার ও মাইক" },
  { en: "Housing & Back Glass", bn: "বডি ও ব্যাক গ্লাস" },
  { en: "Full Donor Device", bn: "পার্টসের জন্য ডেড ফোন" }
];

const POPULAR_CITIES = [
  "Dhaka",
  "Chattogram",
  "Khulna",
  "Rajshahi",
  "Sylhet",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Gazipur",
  "Narayanganj"
];

const POPULAR_TAGS = [
  { tag: "#OriginalDisplay", labelBn: "আসল ডিসপ্লে", labelEn: "Original Display" },
  { tag: "#OriginalBattery", labelBn: "অরিজিনাল ব্যাটারি", labelEn: "Original Battery" },
  { tag: "#DeadMotherboard", labelBn: "ডেড মাদারবোর্ড", labelEn: "Dead Motherboard" },
  { tag: "#BrokenScreen", labelBn: "ভাঙা স্ক্রিন", labelEn: "Broken Screen" },
  { tag: "#CameraWorking", labelBn: "ক্যামেরা সচল", labelEn: "Camera Working" },
  { tag: "#FreshHousing", labelBn: "বডি ফ্রেশ", labelEn: "Fresh Housing" },
  { tag: "#PartsDonor", labelBn: "ডোনার পার্টস", labelEn: "Parts Donor" },
  { tag: "#FastCharging", labelBn: "ফাস্ট চার্জিং", labelEn: "Fast Charging" },
  { tag: "#FingerprintOK", labelBn: "ফিঙ্গারপ্রিন্ট সচল", labelEn: "Fingerprint OK" },
  { tag: "#UrgentSale", labelBn: "জরুরি সেল", labelEn: "Urgent Sale" },
  { tag: "#SwapPossible", labelBn: "এক্সচেঞ্জ সম্ভব", labelEn: "Swap Possible" }
];

export default function PostAdPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { language, t } = useLanguage();

  const [listingType, setListingType] = useState<"SELL" | "BUY" | "REPAIR_OFFER" | "REPAIR_REQUEST">("SELL");
  const [form, setForm] = useState({
    partType: "Display / Screen",
    phoneBrand: "",
    phoneModel: "",
    condition: "USED_GOOD",
    price: "",
    location: "",
    description: ""
  });

  // Search Tags State
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const INTENT_OPTIONS = [
    {
      value: "SELL",
      title: t("post_ad_sell_title"),
      subtitle: t("post_ad_sell_sub"),
      icon: TagIcon,
      iconColor: "text-emerald-600 bg-emerald-50"
    },
    {
      value: "BUY",
      title: t("post_ad_buy_title"),
      subtitle: t("post_ad_buy_sub"),
      icon: Search,
      iconColor: "text-sky-600 bg-sky-50"
    },
    {
      value: "REPAIR_OFFER",
      title: t("post_ad_repair_offer_title"),
      subtitle: t("post_ad_repair_offer_sub"),
      icon: Wrench,
      iconColor: "text-indigo-600 bg-indigo-50"
    },
    {
      value: "REPAIR_REQUEST",
      title: t("post_ad_repair_req_title"),
      subtitle: t("post_ad_repair_req_sub"),
      icon: Hammer,
      iconColor: "text-amber-600 bg-amber-50"
    }
  ];

  // Tag Handlers
  function handleAddTag(rawTag: string) {
    let clean = rawTag.trim().replace(/^#+/, "").replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, "");
    if (!clean) return;
    const formatted = `#${clean}`;
    if (!tags.includes(formatted)) {
      if (tags.length >= 10) {
        setError(language === "bn" ? "সর্বোচ্চ ১০টি ট্যাগ যোগ করতে পারবেন।" : "You can add up to 10 tags.");
        return;
      }
      setTags([...tags, formatted]);
    }
    setTagInput("");
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  }

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (photoUrls.length + files.length > 5) {
      setError(language === "bn" ? "সর্বোচ্চ ৫টি ছবি আপলোড করা যাবে।" : "You can upload a maximum of 5 photos.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `${crypto.randomUUID()}-${cleanName}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setPhotoUrls((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(language === "bn" 
        ? "ছবি আপলোড করা যায়নি। ইন্টারনেট সংযোগ ও ছবির ফাইল সাইজ চেক করুন।"
        : "Couldn't upload one or more photos. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemovePhoto(indexToRemove: number) {
    setPhotoUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.phoneBrand.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে ডিভাইসের ব্র্যান্ড লিখুন।" : "Please provide the device brand.");
      return;
    }
    if (!form.phoneModel.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে ডিভাইসের মডেল লিখুন।" : "Please provide the device model.");
      return;
    }
    if (!form.location.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে আপনার লোকেশন লিখুন।" : "Please provide your location.");
      return;
    }
    if (!form.description.trim()) {
      setError(language === "bn" ? "অনুগ্রহ করে বিস্তারিত বিবরণ লিখুন।" : "Please write a brief description.");
      return;
    }

    setSubmitting(true);

    try {
      // Append tags to description for instant full-text indexing and search matching
      const tagsSuffix = tags.length > 0 ? `\n\nTags: ${tags.join(" ")}` : "";
      const finalDescription = `${form.description.trim()}${tagsSuffix}`;

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingType,
          ...form,
          description: finalDescription,
          price: form.price ? Number(form.price) : null,
          photoUrls
        })
      });

      setSubmitting(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 401) {
          setError(language === "bn" 
            ? "বিজ্ঞাপন প্রকাশ করতে প্রথমে লগইন করুন।" 
            : "Please log in first to publish your listing.");
          return;
        }
        setError(data.error ?? (language === "bn" ? "বিজ্ঞাপন প্রকাশে সমস্যা হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong. Please try again."));
        return;
      }

      const listing = await res.json();
      router.push(`/listings/${listing.id}`);
    } catch (err: any) {
      setSubmitting(false);
      setError(err?.message || (language === "bn" ? "বিজ্ঞাপন প্রকাশ ব্যর্থ হয়েছে।" : "Submission failed. Please try again."));
    }
  }

  return (
    // Page canvas background: sampled exact light sky-blue #ddf1fd from design reference
    <div className="bg-[#ddf1fd] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Page Header (Design styled like the reference picture header) */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t("post_ad_title")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t("post_ad_subtitle")}
            </p>
          </div>
        </div>

        {/* Not Logged In Warning Banner */}
        {status === "unauthenticated" && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                {language === "bn"
                  ? "বিজ্ঞাপনটি প্রকাশ করতে আপনার অ্যাকাউন্টে লগইন থাকা প্রয়োজন।"
                  : "You need to be logged in to publish this listing."}
              </span>
            </div>
            <Link
              href="/login?callbackUrl=/post-ad"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 shadow-sm"
            >
              <LogIn className="h-3.5 w-3.5" />
              {t("header_login")}
            </Link>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* =========================================================================
              SECTION 1: LISTING INTENT (Header banner #eaf4fe + border #cbe2f8)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header with light sky-blue background */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_intent_label")}</span>
              </h2>
              <span className="text-[11px] text-[#0369a1]/80 font-medium hidden sm:inline">
                {language === "bn" ? "বিজ্ঞাপনের ধরন নির্বাচন করুন" : "Select Ad Intent"}
              </span>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {INTENT_OPTIONS.map((opt) => {
                  const isSelected = listingType === opt.value;
                  const Icon = opt.icon;

                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setListingType(opt.value as any)}
                      className={`flex flex-col p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                        isSelected
                          ? "bg-[#0284c7] text-white border-[#0284c7] shadow-md shadow-sky-500/25 ring-2 ring-sky-200"
                          : "bg-white border-[#cbd5e1] text-slate-700 hover:border-sky-400 hover:shadow-sm hover:shadow-sky-100 hover:-translate-y-0.5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`p-2 rounded-lg shrink-0 transition-colors ${
                          isSelected ? "bg-white/20 text-white" : opt.iconColor
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                        )}
                      </div>
                      <span className="block text-sm font-bold leading-snug">
                        {opt.title}
                      </span>
                      <span className={`block text-[11px] mt-0.5 line-clamp-1 ${
                        isSelected ? "text-sky-100" : "text-slate-400"
                      }`}>
                        {opt.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 2: DEVICE & COMPONENT DETAILS (Header banner #eaf4fe + border #cbe2f8)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_sec_device")}</span>
              </h2>
              <span className="text-[11px] text-[#0369a1]/80 font-medium hidden sm:inline">
                {language === "bn" ? "সঠিক মডেল নির্বাচন করুন" : "Device details"}
              </span>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Brand Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="phoneBrand">
                    {t("post_ad_brand_label")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneBrand"
                    type="text"
                    placeholder="e.g. Samsung, Apple, Xiaomi, HP"
                    value={form.phoneBrand}
                    onChange={(e) => setForm({ ...form, phoneBrand: e.target.value })}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                  />
                  {/* Popular Brand Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1 self-center">{language === "bn" ? "দ্রুত:" : "Quick:"}</span>
                    {POPULAR_BRANDS.slice(0, 6).map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm({ ...form, phoneBrand: b })}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 active:scale-95 transition-all"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Model Field */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="phoneModel">
                    {t("post_ad_model_label")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phoneModel"
                    type="text"
                    placeholder="e.g. Galaxy A33, iPhone 12, Pavilion 15"
                    value={form.phoneModel}
                    onChange={(e) => setForm({ ...form, phoneModel: e.target.value })}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                  />
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {language === "bn" ? "মডেল নম্বর সঠিকভাবে লিখুন (যেমন: A33, Note 10)" : "Exact model ensures component compatibility"}
                  </span>
                </div>

                {/* Part Type Field with custom styled dropdown chevron */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="partType">
                    {t("post_ad_part_label")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="partType"
                      value={form.partType}
                      onChange={(e) => setForm({ ...form, partType: e.target.value })}
                      className="w-full h-11 px-3.5 pr-9 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 cursor-pointer appearance-none"
                    >
                      {COMMON_PARTS.map((p) => (
                        <option key={p.en} value={p.en}>
                          {language === "bn" ? p.bn : p.en}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Condition Field with custom styled dropdown chevron */}
                <div className="relative">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="condition">
                    {t("post_ad_condition_label")} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="condition"
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value })}
                      className="w-full h-11 px-3.5 pr-9 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 cursor-pointer appearance-none"
                    >
                      <option value="NEW">{t("cond_new")}</option>
                      <option value="USED_GOOD">{t("cond_used")}</option>
                      <option value="USED_FAIR">{t("cond_fair")}</option>
                      <option value="FOR_PARTS">{t("cond_parts")}</option>
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 3: PRICING & LOCATION (Header banner #eaf4fe + border #cbe2f8)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_sec_pricing")}</span>
              </h2>
              <span className="text-[11px] text-[#0369a1]/80 font-medium hidden sm:inline">
                {language === "bn" ? "মূল্য ও এলাকা নির্ধারণ" : "Pricing & Meetup"}
              </span>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Expected Price */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="price">
                    {t("post_ad_price_label")}
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-slate-400">৳</span>
                    <input
                      id="price"
                      type="number"
                      placeholder="e.g. 2000"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                    />
                  </div>
                  <span className="block text-[10px] text-slate-400 mt-1">
                    {t("post_ad_price_hint")}
                  </span>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="location">
                    {t("post_ad_location_label")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    placeholder="e.g. Dhanmondi, Dhaka or Mirpur 10"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    required
                    className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                  />
                  {/* Popular City Quick Chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold mr-1 self-center">{language === "bn" ? "শহর:" : "City:"}</span>
                    {POPULAR_CITIES.slice(0, 5).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => setForm({ ...form, location: city })}
                        className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 active:scale-95 transition-all"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 4: DETAILED DESCRIPTION & FAULT STATUS (Header banner #eaf4fe)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_sec_desc")}</span>
              </h2>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5" htmlFor="description">
                {language === "bn" ? "যন্ত্রাংশের অবস্থা ও ত্রুটিসমূহ" : "Fault Details & Working State"} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder={t("post_ad_desc_placeholder")}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                className="w-full p-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 resize-y"
              />
            </div>
          </div>

          {/* =========================================================================
              SECTION 5: SEARCH TAGS OPTION (Header banner #eaf4fe + border #cbe2f8)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <Hash className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_sec_tags")}</span>
              </h2>
              {tags.length > 0 && (
                <span className="text-[11px] font-bold text-[#0369a1] bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                  {tags.length} / 10
                </span>
              )}
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <p className="text-xs text-slate-500 mb-3.5">
                {t("post_ad_tags_subtitle")}
              </p>

              {/* Tag Input Field & Button */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">#</span>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={t("post_ad_tag_placeholder")}
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-white border border-[#cbd5e1] text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none hover:border-sky-400 hover:shadow-xs focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  disabled={!tagInput.trim()}
                  className="h-11 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5 shadow-sm shadow-sky-500/20"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("post_ad_add_tag_btn")}</span>
                </button>
              </div>

              {/* Currently Active Tags List */}
              {tags.length > 0 && (
                <div className="mt-3.5 flex flex-wrap gap-2 items-center p-3 rounded-xl bg-sky-50/60 border border-sky-200">
                  <span className="text-[11px] font-bold text-[#0369a1] mr-1 flex items-center gap-1">
                    <TagIcon className="h-3 w-3" />
                    {language === "bn" ? "যুক্ত ট্যাগসমূহ:" : "Active Tags:"}
                  </span>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-sky-300 text-[#0284c7] text-xs font-bold shadow-xs hover:border-sky-400 transition-all"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-4 w-4 rounded-full hover:bg-sky-100 text-sky-500 hover:text-red-500 flex items-center justify-center transition-colors"
                        title={language === "bn" ? "ট্যাগ মুছুন" : "Remove tag"}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Popular Suggested Tags */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-500 mb-2">
                  {t("post_ad_popular_tags_label")}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((item) => {
                    const isAlreadyAdded = tags.includes(item.tag);
                    return (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => {
                          if (isAlreadyAdded) {
                            handleRemoveTag(item.tag);
                          } else {
                            handleAddTag(item.tag);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-1 ${
                          isAlreadyAdded
                            ? "bg-[#0284c7] border-[#0284c7] text-white shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50/60 active:scale-95"
                        }`}
                      >
                        <span>{item.tag}</span>
                        <span className={`text-[10px] ${isAlreadyAdded ? "text-sky-100" : "text-slate-400"}`}>
                          ({language === "bn" ? item.labelBn : item.labelEn})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              SECTION 6: PHOTOS UPLOAD (Header banner #eaf4fe + border #cbe2f8)
             ========================================================================= */}
          <div className="rounded-2xl border border-[#cbe2f8] bg-white overflow-hidden shadow-xs hover:border-sky-300 transition-all duration-200">
            {/* Section Header */}
            <div className="bg-[#eaf4fe] px-5 py-3.5 border-b border-[#cbe2f8] flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-[#0369a1] tracking-tight flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-[#0284c7]" />
                <span>{t("post_ad_sec_photos")}</span>
              </h2>
              <span className="text-[11px] font-bold text-[#0369a1] bg-white px-2.5 py-0.5 rounded-full border border-sky-200">
                {photoUrls.length} / 5
              </span>
            </div>

            {/* Section Body */}
            <div className="p-5 sm:p-7 bg-white">
              <p className="text-xs text-slate-500 mb-3.5">
                {language === "bn" ? "আসল ছবি দিলে ক্রেতারা বেশি আকৃষ্ট হয় এবং দ্রুত বিক্রি হয়" : "Clear photos of device condition attract 3x more reciprocal matches"}
              </p>

              {/* Upload Dropzone */}
              <label className="relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl bg-white border-2 border-dashed border-[#cbd5e1] hover:border-sky-500 hover:bg-sky-50/20 hover:shadow-sm cursor-pointer transition-all duration-200 group active:scale-[0.99]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={uploading || photoUrls.length >= 5}
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <div className="p-3.5 rounded-xl bg-sky-50 text-[#0284c7] group-hover:scale-110 group-hover:bg-sky-100 transition-all mb-3 shadow-sm">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors text-center">
                  {uploading ? t("post_ad_photos_uploading") : t("post_ad_photos_prompt")}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">
                  PNG, JPG, WEBP (Max 5MB per image)
                </span>

                {uploading && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#0284c7] animate-pulse">
                    <div className="h-2 w-2 rounded-full bg-[#0284c7] animate-ping" />
                    <span>{t("post_ad_photos_uploading")}</span>
                  </div>
                )}
              </label>

              {/* Photo Thumbnails with Delete button */}
              {photoUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
                  {photoUrls.map((url, idx) => (
                    <div 
                      key={url} 
                      className="group relative h-24 sm:h-28 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm"
                    >
                      <Image
                        src={url}
                        alt={`Upload ${idx + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        title={language === "bn" ? "ছবি মুছুন" : "Remove photo"}
                        className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center backdrop-blur-sm transition-colors shadow-sm"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-[#0284c7]/95 text-white px-1.5 py-0.5 rounded shadow">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 shadow-sm">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Bottom Action Buttons (Exact style from reference screenshot) */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs"
            >
              <X className="h-4 w-4" />
              <span>{language === "bn" ? "বাতিল" : "Cancel"}</span>
            </Link>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="px-6 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/25 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{submitting ? t("post_ad_submitting_btn") : t("post_ad_submit_btn")}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
