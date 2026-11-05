import Link from "next/link";
import { Smartphone, MonitorSmartphone, BatteryCharging, Cpu, Camera, Plug, Headphones, Laptop, Tablet, Puzzle } from "lucide-react";

const CATEGORIES = [
  { name: "Mobile Phones", icon: Smartphone },
  { name: "Mobile Displays", icon: MonitorSmartphone },
  { name: "Mobile Batteries", icon: BatteryCharging },
  { name: "Mobile Motherboards", icon: Cpu },
  { name: "Mobile Cameras", icon: Camera },
  { name: "Charging Ports", icon: Plug },
  { name: "Mobile Accessories", icon: Headphones },
  { name: "Laptop Components", icon: Laptop },
  { name: "Tablet Components", icon: Tablet },
  { name: "Other Electronics", icon: Puzzle }
];

export default function CategoryStrip() {
  return (
    <div className="px-4 md:px-12 pb-10">
      <h2 className="text-sm font-semibold text-primary mb-4">Browse Categories</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {CATEGORIES.map(({ name, icon: Icon }) => (
          <Link
            key={name}
            href={`/listings?partType=${encodeURIComponent(name)}`}
            className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white px-2 py-4 text-center hover:border-secondary"
          >
            <Icon className="h-5 w-5 text-secondary" />
            <span className="text-xs font-medium text-neutral-700 leading-tight">{name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
