"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    title: "Got a Cracked Display?",
    body: "Thousands of working displays are listed by people who only needed a new battery.",
    cta: "Browse Displays",
    href: "/listings?partType=Display",
    bg: "bg-primary"
  },
  {
    title: "Turn Your Broken Phone Into Cash",
    body: "List your damaged device's working parts — someone needs exactly what you have.",
    cta: "Post an Ad",
    href: "/post-ad",
    bg: "bg-secondary"
  },
  {
    title: "Need a Repair Technician?",
    body: "Browse trusted local repair services and get your device fixed properly.",
    cta: "Find a Technician",
    href: "/listings?type=REPAIR_OFFER",
    bg: "bg-accent"
  }
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="relative px-4 md:px-12 py-6">
      <div className={`relative overflow-hidden rounded-2xl ${slide.bg} text-white px-6 md:px-12 py-10 md:py-14 text-center transition-colors`}>
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">{slide.title}</h2>
        <p className="text-sm md:text-base text-white/85 max-w-xl mx-auto mb-6">{slide.body}</p>
        <Link
          href={slide.href}
          className="inline-block bg-white text-primary font-semibold text-sm px-6 py-3 rounded-lg hover:bg-neutral-50"
        >
          {slide.cta}
        </Link>

        <button
          onClick={() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-2 bg-neutral-300"}`}
          />
        ))}
      </div>
    </div>
  );
}
