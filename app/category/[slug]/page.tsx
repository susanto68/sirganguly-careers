import { notFound } from "next/navigation";
import { JobGrid } from "@/components/jobs/job-grid";
import { SearchFilters } from "@/components/search/search-filters";
import { categorySlugs } from "@/lib/jobs-data";
import { getJobs } from "@/services/job.service";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return categorySlugs.map((item) => ({ slug: item.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = categorySlugs.find((item) => item.slug === slug);
  if (!category) notFound();

  const jobs = await getJobs({ category: category.category });

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-coral">Category</p>
        <h1 className="mt-2 text-4xl font-black">{category.label}</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">Verified active opportunities from official sources only.</p>
      </div>
      <SearchFilters activeCategory={category.category} />
      <div className="mt-6">
        <JobGrid jobs={jobs} />
      </div>
    </section>
  );
}
