import { LockKeyhole, ShieldCheck, Sparkles, TimerReset } from "lucide-react";

const items = [
  { icon: ShieldCheck, label: "Official source verified" },
  { icon: TimerReset, label: "Daily refresh ready" },
  { icon: Sparkles, label: "AI confidence scoring" },
  { icon: LockKeyhole, label: "No consultancy storage" }
];

export function TrustStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div 
            key={item.label} 
            className="flex items-center gap-3 rounded-xl p-4 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white border border-emerald-500/20 shadow-glow transition hover:-translate-y-0.5 hover:shadow-lg dark:from-emerald-800 dark:via-teal-900 dark:to-emerald-950"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/20">
              <item.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-black">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
