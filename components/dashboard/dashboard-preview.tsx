import { Bell, Bookmark, History, Sparkles } from "lucide-react";

const rows = [
  { icon: Bookmark, label: "Saved verified jobs", value: "24" },
  { icon: Bell, label: "Deadline reminders", value: "7" },
  { icon: History, label: "Recent searches", value: "18" },
  { icon: Sparkles, label: "AI recommendations", value: "42" }
];

export function DashboardPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Student dashboard</p>
          <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight sm:text-4xl">Track the opportunities that matter before deadlines disappear.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Save jobs, review recent searches, get deadline alerts, and keep a clean list of only official apply links.
          </p>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {rows.map((row) => (
              <div key={row.label} className="rounded-lg bg-white p-4 dark:bg-slate-900">
                <row.icon className="h-5 w-5 text-emerald-600" />
                <div className="mt-4 text-3xl font-black">{row.value}</div>
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{row.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
