import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { CategoryGrid } from "@/components/jobs/category-grid";
import { CompanyStrip } from "@/components/jobs/company-strip";
import { JobGrid } from "@/components/jobs/job-grid";
import { HeroSearch } from "@/components/search/hero-search";
import { DashboardPreview } from "@/components/dashboard/dashboard-preview";
import { TrustStrip } from "@/components/trust/trust-strip";
import { getCompanies } from "@/services/company.service";
import { getJobs } from "@/services/job.service";
import { isEndingSoon, isNewOpening } from "@/utils/dates";

export default async function HomePage() {
  const [jobs, companies] = await Promise.all([getJobs(), getCompanies()]);
  const urgentJobs = jobs.filter((job) => isEndingSoon(job.deadline)).slice(0, 4);
  const newJobs = jobs.filter((job) => isNewOpening(job.openedAt)).slice(0, 4);
  const priorityAccents = [
    "from-rose-500/18 via-white/10 to-white/5 border-rose-300/30",
    "from-amber-400/18 via-white/10 to-white/5 border-amber-300/30",
    "from-emerald-400/18 via-white/10 to-white/5 border-emerald-300/30"
  ];

  return (
    <>
      <section className="relative overflow-hidden px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 text-sm font-black text-emerald-800 shadow-card dark:bg-slate-900/75 dark:text-emerald-200">
                <ShieldCheck className="h-4 w-4" />
                Official apply links only
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] tracking-normal sm:text-6xl">
                Verified jobs, internships, and government opportunities for students.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Search trusted company career pages, government portals, and internship sources with AI-powered filtering that removes fake, duplicate, and expired listings.
              </p>
              <div className="mt-8">
                <HeroSearch />
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified domains</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Deadline priority</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Student summaries</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-300 via-sky-300 to-coral p-[1px] shadow-glow">
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-white/30 via-transparent to-white/20" />
              <div className="relative rounded-xl bg-[linear-gradient(135deg,#07111f_0%,#0f2f3d_46%,#3a2415_100%)] p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="inline-flex rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-black uppercase text-emerald-100 ring-1 ring-emerald-200/25">
                      AI priority board
                    </p>
                    <h2 className="mt-4 text-3xl font-black leading-tight">Ending within 7 days</h2>
                    <p className="mt-2 max-w-sm text-sm font-semibold leading-6 text-slate-200">
                      Urgent verified openings are ranked first so students can act before deadlines close.
                    </p>
                  </div>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/15 text-emerald-100 ring-1 ring-white/20">
                    <Sparkles className="h-6 w-6" />
                  </span>
                </div>
                <div className="mt-5 grid gap-3">
                  {urgentJobs.slice(0, 3).map((job, index) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className={`group rounded-lg border bg-gradient-to-r p-4 transition hover:-translate-y-0.5 hover:bg-white/15 ${priorityAccents[index]}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-black leading-5">{job.title}</div>
                          <div className="mt-1 text-xs font-semibold text-slate-200">{job.company} - {job.location}</div>
                        </div>
                        <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-black text-emerald-100">
                          {job.confidenceScore}%
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/jobs" className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-white px-4 text-sm font-black text-ink transition hover:bg-emerald-50">
                  Explore all verified jobs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustStrip />
      <CategoryGrid />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">High priority</p>
            <h2 className="mt-2 text-3xl font-black">Jobs ending soon</h2>
          </div>
          <Link href="/jobs" className="text-sm font-black text-emerald-700 dark:text-emerald-300">View all</Link>
        </div>
        <JobGrid jobs={urgentJobs} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Freshly opened</p>
          <h2 className="mt-2 text-3xl font-black">New openings</h2>
        </div>
        <JobGrid jobs={newJobs} />
      </section>

      <CompanyStrip companies={companies} />
      <DashboardPreview />
    </>
  );
}
