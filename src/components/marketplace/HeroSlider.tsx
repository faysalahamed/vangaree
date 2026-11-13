"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const SLIDES = [
  {
    id: 1,
    badge_en: "Mobile & Tablet Parts Exchange",
    badge_bn: "মোবাইল ও ট্যাবলেট পার্টস এক্সচেঞ্জ",
    title_en: "Cracked Display? Dead Battery?",
    title_bn: "ভাঙা ডিসপ্লে? নষ্ট ব্যাটারি?",
    description_en: "Thousands of working original displays, batteries, and motherboards are listed by owners. Match parts and revive your device.",
    description_bn: "হাজারো অরিজিনাল ডিসপ্লে ও ব্যাটারি বিজ্ঞাপন দেওয়া আছে। পার্টস ম্যাচ করে আপনার প্রিয় ফোনটি আবার সচল করুন।",
    cta_en: "Browse Phone Parts",
    cta_bn: "মোবাইল পার্টস দেখুন",
    ctaLink: "/listings?partType=Display",
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    badge_en: "Laptops & Computer Hardware",
    badge_bn: "ল্যাপটপ ও কম্পিউটার হার্ডওয়্যার",
    title_en: "Salvaged Motherboards & Components",
    title_bn: "অরিজিনাল মাদারবোর্ড ও কম্পোনেন্ট",
    description_en: "Find genuine RAM, SSDs, screens, keyboards, and logic boards from donor laptops across all major brands.",
    description_bn: "বিভিন্ন ব্র্যান্ডের ডোনার ল্যাপটপ থেকে অরিজিনাল র‍্যাম, এসএসডি, ডিসপ্লে ও মাদারবোর্ড সংগ্রহ করুন।",
    cta_en: "Explore Laptop Parts",
    cta_bn: "ল্যাপটপ পার্টস খুঁজুন",
    ctaLink: "/listings?q=Laptop",
    imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    badge_en: "All Electronics & Gadgets",
    badge_bn: "সকল ইলেকট্রনিক্স ও গ্যাজেট",
    title_en: "TVs, Audio, Cameras & Appliances",
    title_bn: "স্মার্ট টিভি, অডিও, ক্যামেরা ও হোম অ্যাপ্লায়েন্স",
    description_en: "Got a TV with a broken panel or a soundbar with a dead power board? Find or sell donor components with ease.",
    description_bn: "টিভি প্যানেল বা পাওয়ার সার্কিট নষ্ট? ডোনার ডিভাইস থেকে প্রয়োজনীয় পার্টস খুঁজুন অথবা বিক্রি করুন।",
    cta_en: "Browse All Electronics",
    cta_bn: "সকল ডিভাইস দেখুন",
    ctaLink: "/listings",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    badge_en: "Instant Cash for Broken Tech",
    badge_bn: "নষ্ট ডিভাইস বিক্রি করে নগদ টাকা",
    title_en: "Turn Your Broken Devices Into Cash",
    title_bn: "অপ্রয়োজনীয় নষ্ট ফোন বিক্রি করে দিন",
    description_en: "Don't throw away that device sitting in your drawer. Someone needs its working parts right now. Post an ad in 2 minutes.",
    description_bn: "ড্রয়ারে ফেলে না রেখে আপনার নষ্ট ফোনের ভালো পার্টসগুলো অন্যের কাছে বিক্রি করে টাকা আয় করুন।",
    cta_en: "Post Free Ad Now",
    cta_bn: "এখনই ফ্রি বিজ্ঞাপন দিন",
    ctaLink: "/post-ad",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function HeroSlider() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const slide = SLIDES[current];
  const badge = language === "bn" ? slide.badge_bn : slide.badge_en;
  const title = language === "bn" ? slide.title_bn : slide.title_en;
  const description = language === "bn" ? slide.description_bn : slide.description_en;
  const cta = language === "bn" ? slide.cta_bn : slide.cta_en;

  return (
    <div 
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-3xl h-[280px] sm:h-[340px] md:h-[380px] shadow-xl border border-slate-200">
        
        {/* Background Image with Fallback and Smooth Transition */}
        {SLIDES.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <Image
              src={s.imageUrl}
              alt={s.title_en}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            {/* Rich Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-transparent sm:w-3/4" />
          </div>
        ))}

        {/* Slide Content */}
        <div className="relative z-20 h-full flex flex-col justify-center max-w-xl px-6 sm:px-12 md:px-16 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-bold w-fit mb-3 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-300" />
            {badge}
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2 drop-shadow-md">
            {title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3 drop-shadow">
            {description}
          </p>

          <div>
            <Link
              href={slide.ctaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-900/40 transition-all hover:scale-105"
            >
              <span>{cta}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-30 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-md"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-sky-400" : "w-2 bg-white/50 hover:bg-white"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
