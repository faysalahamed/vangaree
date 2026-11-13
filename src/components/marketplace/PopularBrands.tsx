import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

const BRANDS = [
  {
    name: "Apple",
    badge: "iOS",
    models: "iPhone 11, 12, 13, 14, 15 Pro",
    popularParts: "Original OLED Displays, Batteries, Cameras",
    color: "from-slate-900 to-slate-800",
    textColor: "text-white",
    query: "Apple"
  },
  {
    name: "Samsung",
    badge: "Galaxy",
    models: "A52, A53, S21, S22, S23 Ultra",
    popularParts: "Super AMOLED Screens, Motherboards, Frames",
    color: "from-blue-900 to-indigo-900",
    textColor: "text-white",
    query: "Samsung"
  },
  {
    name: "Xiaomi",
    badge: "Redmi / Poco",
    models: "Note 10, Note 11, Note 12, Poco X3",
    popularParts: "Displays, Charging Boards, Batteries",
    color: "from-amber-600 to-orange-700",
    textColor: "text-white",
    query: "Xiaomi"
  },
  {
    name: "Google",
    badge: "Pixel",
    models: "Pixel 6, 7, 7a, 8 Pro",
    popularParts: "Original Cameras, OLED Screens, Housings",
    color: "from-slate-800 to-teal-900",
    textColor: "text-white",
    query: "Google"
  },
  {
    name: "OnePlus",
    badge: "Oxygen",
    models: "Nord, 8T, 9 Pro, 10T, 11",
    popularParts: "Fluid AMOLED Screens, Motherboards",
    color: "from-red-800 to-rose-900",
    textColor: "text-white",
    query: "OnePlus"
  },
  {
    name: "Vivo",
    badge: "V / Y Series",
    models: "V21, V23, Y20, Y21",
    popularParts: "LCD / AMOLED Displays, Batteries",
    color: "from-sky-700 to-blue-800",
    textColor: "text-white",
    query: "Vivo"
  },
  {
    name: "Realme",
    badge: "Number / GT",
    models: "Realme 8, 9, 10, GT Master",
    popularParts: "Displays, Fingerprint Sensors, Boards",
    color: "from-yellow-600 to-amber-700",
    textColor: "text-white",
    query: "Realme"
  },
  {
    name: "Oppo",
    badge: "Reno / F",
    models: "Reno 6, 7, 8, F19, F21 Pro",
    popularParts: "Original Displays, Main Cameras, Ports",
    color: "from-emerald-700 to-teal-800",
    textColor: "text-white",
    query: "Oppo"
  }
];

export default function PopularBrands() {
  return (
    <section className="px-4 md:px-12 py-12 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 text-xs font-bold mb-2">
              <Smartphone className="h-3.5 w-3.5 text-secondary-600" />
              Direct Brand Matching
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Popular Device Brands
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find compatible genuine salvage parts and donor phones grouped by your device manufacturer.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            Browse all brands
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BRANDS.map((brand) => (
            <Link
              key={brand.name}
              href={`/listings?q=${encodeURIComponent(brand.query)}`}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-secondary-400 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base font-extrabold text-slate-900 group-hover:text-primary transition-colors">
                    {brand.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {brand.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-1">
                  {brand.models}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {brand.popularParts}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-secondary-600 group-hover:text-primary">
                <span>View Parts</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
