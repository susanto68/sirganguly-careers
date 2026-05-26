import { cn } from "@/lib/utils";

export function Badge({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "amber" | "sky" | "rose" | "slate" | "violet" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        tone === "emerald" && "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
        tone === "amber" && "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
        tone === "sky" && "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
        tone === "rose" && "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
        tone === "slate" && "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100",
        tone === "violet" && "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-200"
      )}
    >
      {children}
    </span>
  );
}
