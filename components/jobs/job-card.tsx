import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, CheckCircle2, MapPin, ShieldCheck } from "lucide-react";
import type { Job } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { deadlineLabel, isEndingSoon, isNewOpening } from "@/utils/dates";

export function JobCard({ job }: { job: Job }) {
  const endingSoon = isEndingSoon(job.deadline);
  const newOpening = isNewOpening(job.openedAt);

  return (
    <article className="glass group rounded-xl p-5 transition hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-slate-900">
          {job.companyLogo ? (
            <Image src={job.companyLogo} alt="" fill sizes="48px" className="object-contain p-2" />
          ) : (
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          )}
        </div>
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
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-ink px-4 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-ink"
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
