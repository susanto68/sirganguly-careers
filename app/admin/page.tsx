import { Activity, Bot, BriefcaseBusiness, Building2, CircleAlert, Database, Link2Off, Users } from "lucide-react";
import { getAdminOverview } from "@/services/admin.service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminOverview();
  const metrics = [
    ["Active jobs", data.activeJobs, BriefcaseBusiness, "text-emerald-600"],
    ["Expired hidden", data.expiredJobs, CircleAlert, "text-rose-600"],
    ["Government", data.governmentJobs, Building2, "text-sky-600"],
    ["Private", data.privateJobs, BriefcaseBusiness, "text-violet-600"],
    ["Visitors today", data.analytics.visitorsToday, Users, "text-cyan-600"],
    ["Online now", data.analytics.onlineVisitors, Activity, "text-emerald-600"],
    ["Broken links", data.brokenLinks, Link2Off, "text-amber-600"],
    ["Failed crawlers", data.failedCrawlers, CircleAlert, "text-rose-600"]
  ] as const;
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">Operations center</p>
      <h1 className="mt-2 text-4xl font-black">Career portal health</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">A truthful view of jobs, crawlers, links, analytics, database, and AI providers.</p>
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(([label, value, Icon, color]) => <div key={label} className="glass rounded-lg p-5"><Icon className={`h-5 w-5 ${color}`} /><div className="mt-4 text-3xl font-black">{value}</div><div className="mt-1 text-sm font-bold text-slate-500">{label}</div></div>)}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-lg bg-slate-950 p-6 text-white"><Database className="h-6 w-6 text-emerald-300" /><h2 className="mt-4 text-xl font-black">Data pipeline</h2><p className="mt-2 text-sm text-slate-300">Mode: {data.backend.mode}. Refresh: {data.backend.refresh.mode}. Active opportunities: {data.activeJobs}.</p><p className="mt-3 text-sm text-slate-300">Supabase-backed expiry, deduplication, refresh logs, and analytics activate when production environment variables are present.</p></section>
        <section className="rounded-lg bg-gradient-to-br from-violet-600 to-cyan-600 p-6 text-white"><Bot className="h-6 w-6" /><h2 className="mt-4 text-xl font-black">AI processing</h2><p className="mt-2 text-sm text-white/85">{data.backend.ai.primaryBrain}. Provider readiness is shown without hiding fallback mode.</p><div className="mt-4 flex flex-wrap gap-2">{data.backend.providers.map((provider) => <span key={provider.name} className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">{provider.name}: {provider.configured ? "Ready" : "Needs env"}</span>)}</div></section>
      </div>
    </div>
  );
}
