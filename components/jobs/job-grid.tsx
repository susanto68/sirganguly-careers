import type { Job } from "@/types/job";
import { JobCard } from "@/components/jobs/job-card";

export function JobGrid({ jobs }: { jobs: Job[] }) {
  if (!jobs.length) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <h2 className="text-xl font-black">No verified jobs found</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try another keyword or category. Expired and unverified jobs are hidden automatically.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
