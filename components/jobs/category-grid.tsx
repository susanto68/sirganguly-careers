import Link from "next/link";
import { Banknote, Building2, GraduationCap, Landmark, Laptop, Plane, RadioTower, School, Wifi } from "lucide-react";
import { categorySlugs } from "@/lib/jobs-data";

const icons = [Landmark, Building2, GraduationCap, Wifi, Banknote, RadioTower, Laptop, School, Plane];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Browse faster</p>
          <h2 className="mt-2 text-3xl font-black">Popular categories</h2>
        </div>
        <Link href="/jobs" className="text-sm font-black text-emerald-700 dark:text-emerald-300">View all</Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categorySlugs.map((category, index) => {
          const Icon = icons[index] ?? Laptop;
          return (
            <Link 
              key={category.slug} 
              href={`/category/${category.slug}`} 
              className="flex items-center gap-4 rounded-xl p-4 bg-[linear-gradient(135deg,_rgba(16,185,129,0.12)_0%,_rgba(253,224,71,0.12)_50%,_rgba(255,255,255,0.95)_100%)] border border-emerald-500/20 shadow-soft dark:bg-[linear-gradient(135deg,_rgba(6,78,59,0.35)_0%,_rgba(113,63,18,0.15)_50%,_rgba(15,23,42,0.85)_100%)] dark:border-white/10 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white border-t border-white/25 shadow-md">
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-black text-slate-800 dark:text-white">{category.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
