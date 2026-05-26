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
            <div className="glass rounded-xl p-4">
              <div className="rounded-lg bg-ink p-5 text-white dark:bg-white dark:text-ink">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-emerald-300 dark:text-emerald-700">AI priority board</p>
                    <h2 className="mt-1 text-2xl font-black">Ending within 7 days</h2>
                  </div>
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="mt-5 grid gap-3">
                  {urgentJobs.slice(0, 3).map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="rounded-lg bg-white/10 p-3 transition hover:bg-white/15 dark:bg-slate-900/10">
                      <div className="text-sm font-black">{job.title}</div>
                      <div className="mt-1 text-xs font-semibold opacity-75">{job.company} • {job.location}</div>
                    </Link>
                  ))}
                </div>
                <Link href="/jobs" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald-300 dark:text-emerald-700">
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
