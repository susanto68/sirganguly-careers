import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarClock, CheckCircle2, Globe2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { SaveJobButton } from "@/components/jobs/save-job-button";
import { getJobById, getJobs } from "@/services/job.service";
import { deadlineLabel } from "@/utils/dates";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ id: job.id }));
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const job = await getJobById(id);
  if (!job) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.aiSummary || job.eligibility,
    "datePosted": job.openedAt,
    "validThrough": job.deadline,
    "employmentType": job.jobType === "Internship" ? "INTERN" : "FULL_TIME",
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.company,
      "sameAs": job.officialApplyUrl,
      "logo": job.companyLogo
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.location,
        "addressCountry": job.country
      }
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/jobs" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-700 dark:text-slate-300">
        <ArrowLeft className="h-4 w-4" />
        Back to jobs
      </Link>

      <div className="glass rounded-xl p-5 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <CompanyLogo src={job.companyLogo} name={job.company} size="md" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-2">
              <Badge tone="emerald">Verified official source</Badge>
              <Badge tone="sky">{job.confidenceScore}% confidence</Badge>
              {job.fresher && <Badge tone="violet">Fresher friendly</Badge>}
            </div>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">{job.title}</h1>
            <Link href={`/company/${job.companySlug}`} className="mt-3 inline-flex items-center gap-2 text-lg font-bold text-slate-600 hover:text-emerald-700 dark:text-slate-300">
              {job.company}
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </Link>
          </div>
          <SaveJobButton jobId={job.id} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <MapPin className="h-5 w-5 text-coral" />
            <div className="mt-3 text-sm font-semibold text-slate-500">Location</div>
            <div className="font-black">{job.location}</div>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <CalendarClock className="h-5 w-5 text-rose-600" />
            <div className="mt-3 text-sm font-semibold text-slate-500">Deadline</div>
            <div className="font-black">{deadlineLabel(job.deadline)}</div>
          </div>
          <div className="rounded-lg bg-white p-4 dark:bg-slate-900">
            <Globe2 className="h-5 w-5 text-emerald-600" />
            <div className="mt-3 text-sm font-semibold text-slate-500">Source</div>
            <div className="font-black">{job.sourceDomain}</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-black">Student-friendly AI summary</h2>
            <p className="mt-3 rounded-lg bg-white p-5 leading-7 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{job.aiSummary}</p>

            <h2 className="mt-8 text-xl font-black">Eligibility</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{job.eligibility}</p>
          </div>
          <aside className="rounded-xl bg-white p-5 dark:bg-slate-900">
            <h2 className="text-xl font-black">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} tone="slate">{skill}</Badge>
              ))}
            </div>
            <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm leading-6 text-emerald-950 dark:bg-emerald-400/10 dark:text-emerald-100">
              This site does not collect job applications. You will be redirected to the official company or government application page.
            </div>
            <a
              href={job.officialApplyUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-3d-emerald mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg px-5 font-black text-white"
            >
              Apply Now
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={job.sourceUrl}
              rel="noreferrer"
              className="btn-3d-white mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-black text-slate-800"
            >
              View official source
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
