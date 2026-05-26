import { JobGrid } from "@/components/jobs/job-grid";
import { getJobs } from "@/services/job.service";

export default async function SavedPage() {
  const jobs = (await getJobs()).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Saved jobs</p>
        <h1 className="mt-2 text-4xl font-black">Bookmarked opportunities</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          The job card bookmark control stores local saves immediately. The API route is ready for Firebase-authenticated cloud saves.
        </p>
      </div>
      <JobGrid jobs={jobs} />
    </section>
  );
}
