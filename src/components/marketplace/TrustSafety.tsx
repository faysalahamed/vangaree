import { ShieldCheck, Flag, UserCheck, Lock } from "lucide-react";

const POINTS = [
  { icon: UserCheck, title: "Verified listings", body: "All ads go through moderation before going live." },
  { icon: Flag, title: "Report anything suspicious", body: "Flag a listing or user in one tap — our team reviews every report." },
  { icon: Lock, title: "Your contact stays private", body: "Phone numbers are only shared when you choose to reveal them." },
  { icon: ShieldCheck, title: "Meet safely", body: "We recommend public meetup spots and daylight exchanges." }
];

export default function TrustSafety() {
  return (
    <section className="px-4 md:px-12 py-14">
      <h2 className="text-lg font-bold text-primary text-center mb-10">Trust &amp; Safety</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {POINTS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-neutral-200 p-5">
            <Icon className="h-5 w-5 text-accent mb-3" />
            <h3 className="text-sm font-bold text-primary-800 mb-1">{title}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
