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
          <div key={item.label} className="glass flex items-center gap-3 rounded-xl p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200">
              <item.icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-black">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
