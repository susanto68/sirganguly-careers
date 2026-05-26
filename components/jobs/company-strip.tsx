import Image from "next/image";
import Link from "next/link";
import type { Company } from "@/types/company";
import { Badge } from "@/components/ui/badge";

export function CompanyStrip({ companies }: { companies: Company[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-iris">Trusted sources</p>
          <h2 className="mt-2 text-3xl font-black">Top verified organizations</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Link key={company.id} href={`/company/${company.slug}`} className="glass rounded-xl p-5 transition hover:-translate-y-1 hover:shadow-glow">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white dark:bg-slate-900">
                <Image src={company.logo} alt="" fill sizes="48px" className="object-contain p-2" />
              </div>
              <div>
                <h3 className="font-black">{company.name}</h3>
                <Badge tone={company.category === "Government" ? "amber" : "emerald"}>{company.category}</Badge>
              </div>
            </div>
            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{company.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
