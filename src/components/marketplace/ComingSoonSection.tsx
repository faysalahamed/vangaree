import { Sparkles } from "lucide-react";

export default function ComingSoonSection({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="px-4 md:px-12 py-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-primary">{title}</h2>
        <span className="flex items-center gap-1 text-xs font-medium text-secondary bg-secondary-50 px-2.5 py-1 rounded-full">
          <Sparkles className="h-3 w-3" /> Phase 2
        </span>
      </div>
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center">
        <p className="text-sm text-neutral-500 max-w-md mx-auto">{description}</p>
      </div>
    </section>
  );
}
