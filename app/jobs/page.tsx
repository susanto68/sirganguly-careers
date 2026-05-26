import type { Metadata } from "next";
import { JobGrid } from "@/components/jobs/job-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { HeroSearch } from "@/components/search/hero-search";
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
  const jobs = await searchJobs({
    query: params?.q,
    location: params?.location,
    remote: params?.remote === "true",
    fresher: params?.fresher === "true"
  });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Verified search</p>
        <h1 className="mt-2 text-4xl font-black">Find active official opportunities</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Expired, duplicate, and unverified listings are filtered before results are shown.</p>
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
