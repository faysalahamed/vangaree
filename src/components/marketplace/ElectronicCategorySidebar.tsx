import Link from "next/link";
import { 
  Smartphone, 
  Laptop, 
  Tv, 
  Headphones, 
  Camera, 
  Gamepad2, 
  Wind, 
  Watch, 
  Cpu, 
  Wrench, 
  ChevronRight,
  Layers,
  Sparkles
} from "lucide-react";

const ELECTRONIC_CATEGORIES = [
  {
    name: "Phones & Tablets",
    query: "Phone",
    count: "128+ ads",
    icon: Smartphone,
    iconColor: "text-sky-600 bg-sky-50"
  },
  {
    name: "Laptops & Computers",
    query: "Laptop",
    count: "84+ ads",
    icon: Laptop,
    iconColor: "text-indigo-600 bg-indigo-50"
  },
  {
    name: "Smart TVs & Monitors",
    query: "TV",
    count: "45+ ads",
    icon: Tv,
    iconColor: "text-blue-600 bg-blue-50"
  },
  {
    name: "Audio & Sound Systems",
    query: "Audio",
    count: "32+ ads",
    icon: Headphones,
    iconColor: "text-amber-600 bg-amber-50"
  },
  {
    name: "Cameras & Optical Gear",
    query: "Camera",
    count: "29+ ads",
    icon: Camera,
    iconColor: "text-rose-600 bg-rose-50"
  },
  {
    name: "Gaming & Consoles",
    query: "Gaming",
    count: "41+ ads",
    icon: Gamepad2,
    iconColor: "text-purple-600 bg-purple-50"
  },
  {
    name: "AC & Home Appliances",
    query: "Appliance",
    count: "38+ ads",
    icon: Wind,
    iconColor: "text-teal-600 bg-teal-50"
  },
  {
    name: "Smart Watches & Wearables",
    query: "Watch",
    count: "26+ ads",
    icon: Watch,
    iconColor: "text-cyan-600 bg-cyan-50"
  },
  {
    name: "Motherboards & Circuit ICs",
    query: "Motherboard",
    count: "76+ ads",
    icon: Cpu,
    iconColor: "text-emerald-600 bg-emerald-50"
  },
  {
    name: "Repair & Technician Offers",
    query: "Repair",
    count: "52+ ads",
    icon: Wrench,
    iconColor: "text-orange-600 bg-orange-50"
  }
];

export default function ElectronicCategorySidebar() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
            All Electronic Devices
          </h3>
          <p className="text-[11px] text-slate-500">
            Browse parts &amp; gadgets
          </p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
          Categories
        </span>
      </div>

      {/* Category List Items (Matching Bikroy layout) */}
      <div className="divide-y divide-slate-100">
        {ELECTRONIC_CATEGORIES.map(({ name, query, count, icon: Icon, iconColor }) => (
          <Link
            key={name}
            href={`/listings?q=${encodeURIComponent(query)}`}
            className="group flex items-center justify-between p-3.5 hover:bg-sky-50/70 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconColor} transition-transform group-hover:scale-110`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span className="block text-xs font-bold text-slate-800 group-hover:text-sky-700 transition-colors truncate">
                  {name}
                </span>
                <span className="block text-[10px] text-slate-400">
                  {count}
                </span>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>

      {/* Sidebar Footer Callout */}
      <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 border-t border-sky-100 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-sky-800 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-sky-600" />
          Have a broken device?
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Turn your spare parts into cash now.
        </p>
        <Link
          href="/post-ad"
          className="block w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm"
        >
          + Post Free Ad
        </Link>
      </div>
    </div>
  );
}
