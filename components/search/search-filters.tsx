import Link from "next/link";
import { categorySlugs } from "@/lib/jobs-data";

export function SearchFilters({ activeCategory }: { activeCategory?: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Link
        href="/jobs"
        className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-card dark:bg-slate-800 dark:text-slate-100"
      >
        All
      </Link>
      {categorySlugs.map((item) => (
        <Link
          key={item.slug}
          href={`/category/${item.slug}`}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold shadow-card transition ${
            activeCategory === item.category
              ? "bg-emerald-600 text-white"
              : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
