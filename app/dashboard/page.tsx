import Link from "next/link";
import {
  Activity,
  Bell,
  Bookmark,
  BrainCircuit,
  BriefcaseBusiness,
  Clock3,
  Database,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  Sparkles,
  UserRoundCheck
} from "lucide-react";
import { JobGrid } from "@/components/jobs/job-grid";
import { DashboardRecommender } from "@/components/dashboard/dashboard-recommender";
import { getBackendStatus } from "@/services/backend-status.service";
import { getJobs } from "@/services/job.service";
import { buildJobNotifications } from "@/services/notification.service";
import { isEndingSoon, isNewOpening } from "@/utils/dates";

const statusStyles = [
  "from-emerald-500 to-teal-500",
  "from-sky-500 to-blue-600",
  "from-fuchsia-500 to-violet-600",
  "from-orange-500 to-rose-500"
];

export default async function DashboardPage() {
  const [jobs, backend] = await Promise.all([getJobs(), getBackendStatus()]);
  const urgentJobs = jobs.filter((job) => isEndingSoon(job.deadline)).slice(0, 4);
  const internships = jobs.filter((job) => job.categories.includes("Internship")).slice(0, 4);
  const governmentJobs = jobs.filter((job) => job.categories.includes("Government")).slice(0, 4);
  const notifications = buildJobNotifications(jobs).slice(0, 4);
  const newlyOpened = jobs.filter((job) => isNewOpening(job.openedAt)).length;

  const stats = [
    { icon: BriefcaseBusiness, label: "Verified active jobs", value: backend.counts.activeJobs.toString(), detail: "Official apply links only" },
    { icon: ShieldCheck, label: "Trusted sources", value: backend.counts.trustedCompanies.toString(), detail: "Company and gov domains" },
    { icon: Clock3, label: "Ending soon", value: backend.counts.endingSoon.toString(), detail: "Priority within 7 days" },
    { icon: Sparkles, label: "New openings", value: newlyOpened.toString(), detail: "Freshly highlighted roles" }
  ];

  const providerHighlights = backend.providers.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.28),_transparent_30%),linear-gradient(135deg,_#061826,_#111827_48%,_#312e81)] p-1 shadow-glow">
        <div className="rounded-[1rem] bg-white/88 p-6 backdrop-blur-xl dark:bg-slate-950/70 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Student command center</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-ink dark:text-white sm:text-5xl">
                Find trusted jobs faster, with backend health in plain sight.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                The dashboard now shows verified opportunities, urgent deadlines, AI readiness, database mode, and official-source protection in one simple student view.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/jobs" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-700">
                  <Search className="h-4 w-4" />
                  Search jobs
                </Link>
                <Link href="/saved" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 font-black text-white transition hover:bg-slate-800 dark:bg-white dark:text-ink">
                  <Bookmark className="h-4 w-4" />
                  Saved jobs
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-white/50 bg-white/80 p-5 shadow-soft dark:border-white/10 dark:bg-white/10">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Backend mode</p>
                  <h2 className="mt-1 text-2xl font-black capitalize">{backend.mode.replace("-", " ")}</h2>
                </div>
                <ServerCog className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="mt-5 grid gap-3">
                {providerHighlights.map((item) => (
                  <div key={item.name} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-950/50">
                    <div>
                      <div className="font-black">{item.name}</div>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">{item.detail}</p>
                    </div>
                    <span className={item.configured ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200" : "rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900 dark:bg-amber-400/15 dark:text-amber-200"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/api/health" className="mt-4 inline-flex items-center gap-2 text-sm font-black text-emerald-700 dark:text-emerald-300">
                View health JSON
                <Activity className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <div key={item.label} className={`rounded-xl bg-gradient-to-br ${statusStyles[index]} p-5 text-white shadow-soft`}>
            <item.icon className="h-6 w-6" />
            <div className="mt-5 text-3xl font-black">{item.value}</div>
            <div className="mt-1 font-black">{item.label}</div>
            <p className="mt-2 text-sm font-semibold text-white/85">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-400/20 dark:bg-rose-400/10">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black">Deadline reminders</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {notifications.map((item) => (
              <Link key={item.id} href={`/jobs/${item.jobId}`} className="rounded-lg bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-950/70">
                <div className="font-black">{item.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 grid gap-3 rounded-lg bg-white p-4 text-sm font-semibold text-slate-700 dark:bg-slate-950/70 dark:text-slate-200">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-600" />
              Refresh mode: {backend.refresh.mode}
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-sky-600" />
              Search logs: {backend.search.persistentSearchLogsReady ? "Supabase ready" : "Waiting for Supabase"}
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-fuchsia-600" />
              AI brain: {backend.ai.primaryBrain}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-iris">AI priority ranking</p>
              <h2 className="mt-2 text-3xl font-black">Urgent verified jobs</h2>
            </div>
            <Link href="/jobs" className="text-sm font-black text-emerald-700 dark:text-emerald-300">All jobs</Link>
          </div>
          <JobGrid jobs={urgentJobs} />
        </div>
      </div>

      <div className="mt-10 grid gap-8">
        <div>
          <DashboardRecommender jobs={jobs} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-700 dark:text-sky-300">Internships</p>
              <h2 className="mt-2 text-3xl font-black">Verified internship sources</h2>
            </div>
            <JobGrid jobs={internships} />
          </div>
          <div>
            <div className="mb-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">Government and banking</p>
              <h2 className="mt-2 text-3xl font-black">Official public opportunities</h2>
            </div>
            <JobGrid jobs={governmentJobs} />
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-xl bg-gradient-to-r from-emerald-600 via-sky-600 to-violet-600 p-6 text-white shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/80">Trust promise</p>
            <h2 className="mt-2 text-2xl font-black">No consultancy flow. No fake apply form. Only official links.</h2>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-3 text-sm font-black">
            <UserRoundCheck className="h-4 w-4" />
            Firebase dashboard protection ready
          </div>
        </div>
      </div>
    </section>
  );
}
