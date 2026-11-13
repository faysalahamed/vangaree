"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  Repeat, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw,
  Layers,
  Wrench,
  Check,
  X
} from "lucide-react";

const QUICK_PARTS = ["Display / Screen", "Battery", "Motherboard", "Camera Module", "Housing / Back Glass"];

export default function HeroSection() {
  const router = useRouter();
  const [searchBrand, setSearchBrand] = useState("");
  const [searchPart, setSearchPart] = useState("");
  const [activeTab, setActiveTab] = useState<"match" | "swap">("match");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchBrand) params.set("brand", searchBrand);
    if (searchPart) params.set("partType", searchPart);
    router.push(`/listings?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-primary-800 text-white pt-10 pb-20 md:pt-16 md:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-secondary-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-highlight shadow-inner">
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Bangladesh&apos;s 1st P2P Device Parts &amp; Exchange Platform</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 text-center md:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] mb-5">
              Broken Display? <br className="hidden sm:inline" />
              Dead Battery? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight via-secondary-300 to-accent">
                Match Parts. Revive Both.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
              Don&apos;t let broken devices rot in your drawer. Connect with someone who has 
              the <strong>exact working original part</strong> you need — swap, buy genuine salvaged hardware, 
              or hire vetted local repair technicians.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-10">
              <Link
                href="/listings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent text-white font-bold text-sm shadow-lg shadow-accent/25 hover:bg-emerald-600 hover:scale-[1.02] transition-all duration-200"
              >
                <Search className="h-4 w-4" />
                Find Compatible Parts
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/post-ad"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                <Smartphone className="h-4 w-4 text-highlight" />
                + Post Device / Part (Free)
              </Link>
            </div>

            {/* Quick Hero Search Box */}
            <form 
              onSubmit={handleSearch}
              className="p-2 sm:p-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xl"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="bg-primary-900/90 text-white text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 border border-white/15 outline-none focus:border-highlight"
                >
                  <option value="">Select Brand...</option>
                  <option value="Apple">Apple (iPhone)</option>
                  <option value="Samsung">Samsung Galaxy</option>
                  <option value="Xiaomi">Xiaomi / Redmi</option>
                  <option value="Google">Google Pixel</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Vivo">Vivo</option>
                  <option value="Oppo">Oppo</option>
                  <option value="Realme">Realme</option>
                </select>

                <select
                  value={searchPart}
                  onChange={(e) => setSearchPart(e.target.value)}
                  className="bg-primary-900/90 text-white text-xs sm:text-sm font-medium rounded-xl px-3.5 py-2.5 border border-white/15 outline-none focus:border-highlight flex-1"
                >
                  <option value="">Select Part Needed / Offered...</option>
                  {QUICK_PARTS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-secondary-500 hover:bg-secondary-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>

            {/* Key Trust Stats */}
            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>100% Original OEM Donor Parts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-highlight" />
                <span>Verified Direct Sellers</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-emerald-400" />
                <span>Zero Electronic Waste</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Dual-Device Matchmaker Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Glow Card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 p-6 backdrop-blur-xl border border-white/20 shadow-2xl">
                
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Live Match Simulation
                    </span>
                  </div>
                  <span className="text-[11px] bg-secondary-700/80 text-white px-2.5 py-0.5 rounded-full font-semibold border border-white/15">
                    Samsung Galaxy A52
                  </span>
                </div>

                {/* Device A: User 1 */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 mb-3 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">Rafiq&apos;s Phone</span>
                    </div>
                    <span className="text-[11px] text-red-300 font-semibold bg-red-950/60 px-2 py-0.5 rounded-md border border-red-500/30">
                      Broken Screen
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-2 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5 text-red-300">
                      <X className="h-3 w-3 text-red-400" /> Display: Smashed
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                      <Check className="h-3 w-3 text-accent" /> Battery: 94% Healthy
                    </span>
                  </div>
                </div>

                {/* Exchange Connector Badge */}
                <div className="relative py-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-dashed border-white/20" />
                  </div>
                  <div className="relative z-10 px-4 py-1.5 rounded-full bg-gradient-to-r from-secondary-600 to-primary-700 border border-highlight/40 shadow-lg text-[11px] font-extrabold text-white flex items-center gap-1.5">
                    <Repeat className="h-3.5 w-3.5 text-accent animate-spin" style={{ animationDuration: "6s" }} />
                    <span>RECIPROCAL HARDWARE MATCH</span>
                  </div>
                </div>

                {/* Device B: User 2 */}
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 mt-3 hover:bg-white/15 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                        <Smartphone className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-white">Shila&apos;s Phone</span>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      Display 100% Working
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mt-2 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                      <Check className="h-3 w-3 text-accent" /> Original AMOLED OK
                    </span>
                    <span className="flex items-center gap-1.5 text-red-300">
                      <X className="h-3 w-3 text-red-400" /> Battery: Swollen / Dead
                    </span>
                  </div>
                </div>

                {/* Outcome Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-primary-950/90 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      Result: 1 Revived Device!
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Both owners save ~৳7,500 vs showroom repair.
                    </p>
                  </div>
                  <Link
                    href="/listings"
                    className="px-3 py-1.5 rounded-lg bg-accent text-white font-bold text-[11px] hover:bg-emerald-600 transition-colors shrink-0"
                  >
                    Match Now
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
