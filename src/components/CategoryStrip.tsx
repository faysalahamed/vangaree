import Link from "next/link";

const PARTS = ["Display", "Battery", "Camera", "Charging Port", "Speaker", "Back Panel"];

export default function CategoryStrip() {
  return (
    <div className="px-6 md:px-12 pb-8">
      <h2 className="text-sm font-semibold text-primary mb-3">Browse by part</h2>
      <div className="flex gap-3 flex-wrap">
        {PARTS.map((part) => (
          <Link
            key={part}
            href={`/listings?partType=${encodeURIComponent(part)}`}
            className="border border-line rounded-full px-4 py-2 text-sm text-primary bg-white hover:border-secondary"
          >
            {part}
          </Link>
        ))}
      </div>
    </div>
  );
}
