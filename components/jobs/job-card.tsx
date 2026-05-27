import Link from "next/link";
import { ArrowUpRight, CalendarClock, CheckCircle2, MapPin } from "lucide-react";
import type { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { deadlineLabel, isEndingSoon, isNewOpening } from "@/utils/dates";

export function JobCard({ job }: { job: Job }) {
  const endingSoon = isEndingSoon(job.deadline);
  const newOpening = isNewOpening(job.openedAt);

  return (
    <article className="group rounded-xl border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(240,253,250,0.78)_48%,_rgba(239,246,255,0.82))] p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(12,74,110,0.44)_48%,_rgba(49,46,129,0.34))]">
      <div className="flex items-start gap-4">
        <CompanyLogo src={job.companyLogo} name={job.company} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            {endingSoon && <Badge tone="rose">Ending soon</Badge>}
            {newOpening && <Badge tone="emerald">New</Badge>}
            <Badge tone="sky">{job.confidenceScore}% verified</Badge>
          </div>
          <Link href={`/jobs/${job.id}`} className="mt-3 block">
            <h3 className="text-lg font-black leading-tight text-ink transition group-hover:text-emerald-700 dark:text-white">
              {job.title}
            </h3>
          </Link>
          <Link href={`/company/${job.companySlug}`} className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-emerald-700 dark:text-slate-300">
            {job.company}
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </Link>
        </div>
        <SaveJobButton jobId={job.id} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{job.aiSummary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.categories.slice(0, 4).map((category) => (
          <Badge key={category} tone={category === "Government" ? "amber" : "slate"}>
            {category}
          </Badge>
        ))}
      </div>

      <div className="mt-5 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-coral" />
          {job.location}
        </span>
        <span className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-iris" />
          {deadlineLabel(job.deadline)}
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/jobs/${job.id}`}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-ink"
        >
          View details
        </Link>
        <a
          href={job.officialApplyUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Apply official
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
