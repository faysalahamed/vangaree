import Link from "next/link";
import { ArrowRight, Smartphone, Sparkles } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="px-4 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary-950 via-primary-900 to-secondary-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          {/* Ambient lighting */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-highlight/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-highlight border border-white/15 mb-4">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Free Community Marketplace
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Have an old broken phone in your drawer?
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Someone right now is searching for that exact working screen, camera, or battery. 
              Post your device in under 2 minutes and turn salvageable parts into instant cash.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/post-ad"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-accent hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-accent/20 transition-all duration-200"
              >
                <Smartphone className="h-4 w-4" />
                Post Device or Part Free
              </Link>
              <Link
                href="/listings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm backdrop-blur-sm transition-all duration-200"
              >
                Browse All Spare Parts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
