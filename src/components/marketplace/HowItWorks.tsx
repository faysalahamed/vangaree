import { Camera, SearchCheck, MessageCircle, Handshake } from "lucide-react";

const STEPS = [
  { icon: Camera, title: "List your device", body: "Tell us what's working and what's damaged on your device." },
  { icon: SearchCheck, title: "We find your match", body: "Our matching engine scans for someone with the opposite problem." },
  { icon: MessageCircle, title: "Connect and discuss", body: "Message your match to agree on an exchange, sale, or repair." },
  { icon: Handshake, title: "Complete the exchange", body: "Meet up or ship, and give your device a second life." }
];

export default function HowItWorks() {
  return (
    <section className="px-4 md:px-12 py-14 bg-neutral-50">
      <h2 className="text-lg font-bold text-primary text-center mb-10">How Vangare Works</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <div key={title} className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-xs font-semibold text-secondary mb-1">Step {i + 1}</div>
            <h3 className="text-sm font-bold text-primary-800 mb-1">{title}</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
