import Link from "next/link";
import { 
  Smartphone, 
  MonitorSmartphone, 
  BatteryCharging, 
  Cpu, 
  Camera, 
  Plug, 
  Headphones, 
  Laptop, 
  Tablet, 
  Wrench,
  Layers,
  ArrowRight
} from "lucide-react";

const CATEGORIES = [
  { 
    name: "Displays & Screens", 
    icon: MonitorSmartphone, 
    color: "bg-blue-50 text-blue-600 border-blue-100", 
    tag: "High Demand",
    part: "Display" 
  },
  { 
    name: "Original Batteries", 
    icon: BatteryCharging, 
    color: "bg-emerald-50 text-emerald-600 border-emerald-100", 
    tag: "Popular",
    part: "Battery" 
  },
  { 
    name: "Motherboards & CPUs", 
    icon: Cpu, 
    color: "bg-purple-50 text-purple-600 border-purple-100", 
    tag: "Salvage",
    part: "Motherboard" 
  },
  { 
    name: "Camera Modules", 
    icon: Camera, 
    color: "bg-amber-50 text-amber-600 border-amber-100", 
    tag: "OEM Parts",
    part: "Camera" 
  },
  { 
    name: "Charging & Ports", 
    icon: Plug, 
    color: "bg-cyan-50 text-cyan-600 border-cyan-100", 
    tag: "Replacement",
    part: "Charging Port" 
  },
  { 
    name: "Full Devices for Parts", 
    icon: Smartphone, 
    color: "bg-rose-50 text-rose-600 border-rose-100", 
    tag: "Donor Phones",
    part: "Phone" 
  },
  { 
    name: "Repair Services", 
    icon: Wrench, 
    color: "bg-indigo-50 text-indigo-600 border-indigo-100", 
    tag: "Technicians",
    part: "Repair" 
  },
  { 
    name: "Laptop Components", 
    icon: Laptop, 
    color: "bg-slate-100 text-slate-700 border-slate-200", 
    tag: "Hardware",
    part: "Laptop" 
  },
  { 
    name: "Tablet Parts", 
    icon: Tablet, 
    color: "bg-teal-50 text-teal-600 border-teal-100", 
    tag: "Pads & Tabs",
    part: "Tablet" 
  },
  { 
    name: "Housings & Frames", 
    icon: Layers, 
    color: "bg-orange-50 text-orange-600 border-orange-100", 
    tag: "Back Glass",
    part: "Housing" 
  }
];

export default function CategoryStrip() {
  return (
    <section className="px-4 md:px-12 py-12 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-secondary-600 uppercase tracking-wider">
              Browse by Component
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              What Part Does Your Device Need?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select a component category to explore genuine parts removed from working donor phones.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-secondary-600 hover:text-secondary-800 transition-colors"
          >
            All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map(({ name, icon: Icon, color, tag, part }) => (
            <Link
              key={name}
              href={`/listings?partType=${encodeURIComponent(part)}`}
              className="group flex flex-col items-center p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-secondary hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center"
            >
              <div className={`p-3 rounded-2xl ${color} border mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors leading-snug mb-1">
                {name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {tag}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
