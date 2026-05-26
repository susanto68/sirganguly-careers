import Link from "next/link";
import { Bell, Bookmark, Clock3, Search, Sparkles, UserRoundCheck } from "lucide-react";
import { JobGrid } from "@/components/jobs/job-grid";
import { getJobs } from "@/services/job.service";
import { buildJobNotifications } from "@/services/notification.service";

export default async function DashboardPage() {
  const jobs = await getJobs();
  const recommendations = jobs.filter((job) => job.fresher).slice(0, 4);
  const notifications = buildJobNotifications(jobs).slice(0, 4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Protected dashboard ready</p>
        <h1 className="mt-2 text-4xl font-black">Student opportunity dashboard</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Firebase Authentication hooks are ready for Google and email sign-in. This preview keeps the app useful while credentials are added.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: UserRoundCheck, label: "Auth status", value: "Firebase ready" },
          { icon: Bookmark, label: "Saved jobs", value: "Local + API" },
          { icon: Search, label: "Search history", value: "Tracked" },
          { icon: Sparkles, label: "AI matches", value: recommendations.length.toString() }
        ].map((item) => (
          <div key={item.label} className="glass rounded-xl p-5">
            <item.icon className="h-5 w-5 text-emerald-600" />
            <div className="mt-4 text-2xl font-black">{item.value}</div>
            <div className="text-sm font-semibold text-slate-500">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="glass rounded-xl p-5">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-rose-600" />
            <h2 className="text-xl font-black">Deadline reminders</h2>
          </div>
          <div className="mt-5 grid gap-3">
            {notifications.map((item) => (
              <Link key={item.id} href={`/jobs/${item.jobId}`} className="rounded-lg bg-white p-4 transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800">
                <div className="font-black">{item.title}</div>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg bg-amber-50 p-4 text-sm font-semibold text-amber-900 dark:bg-amber-400/10 dark:text-amber-100">
            <Clock3 className="h-4 w-4" />
            Daily refresh is configured through Vercel Cron.
          </div>
        </aside>

        <div>
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-iris">AI recommendations</p>
            <h2 className="mt-2 text-3xl font-black">Fresher-friendly picks</h2>
          </div>
          <JobGrid jobs={recommendations} />
        </div>
      </div>
    </section>
  );
}
