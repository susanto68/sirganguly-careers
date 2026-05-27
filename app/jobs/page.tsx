import type { Metadata } from "next";
import { JobGrid } from "@/components/jobs/job-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { HeroSearch } from "@/components/search/hero-search";
import { getBackendStatus } from "@/services/backend-status.service";
import { searchJobs } from "@/services/search.service";

export const metadata: Metadata = {
  title: "Verified Jobs"
};

type JobsPageProps = {
  searchParams?: Promise<{
    q?: string;
    location?: string;
    remote?: string;
    fresher?: string;
  }>;
};

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const [jobs, backend] = await Promise.all([searchJobs({
    query: params?.q,
    location: params?.location,
    remote: params?.remote === "true",
    fresher: params?.fresher === "true"
  }), getBackendStatus()]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.28),_transparent_32%),linear-gradient(135deg,_#ecfeff,_#f0fdf4_42%,_#faf5ff)] p-6 shadow-soft dark:bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.22),_transparent_30%),linear-gradient(135deg,_#020617,_#0f172a_48%,_#312e81)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Verified search</p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink dark:text-white">Find active official opportunities</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Expired, duplicate, and unverified listings are filtered before results are shown. Every apply button redirects to an official company or government source.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Results now", value: jobs.length.toString(), tone: "bg-emerald-600" },
            { label: "Search mode", value: backend.mode === "database" ? "Database" : "Seed safe", tone: "bg-sky-600" },
            { label: "AI brain", value: backend.ai.primaryBrain, tone: "bg-violet-600" }
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/85 p-4 shadow-card dark:bg-white/10">
              <div className={`mb-3 h-2 w-12 rounded-full ${item.tone}`} />
              <div className="text-2xl font-black">{item.value}</div>
              <div className="text-sm font-bold text-slate-500 dark:text-slate-300">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-5">
        <HeroSearch />
      </div>
      <SearchFilters />
      <div className="mt-6">
        <JobGrid jobs={jobs} />
      </div>
    </section>
  );
}
