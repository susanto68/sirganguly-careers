import "server-only";
import { getAnalyticsSummary } from "@/services/analytics.service";
import { getBackendStatus } from "@/services/backend-status.service";
import { getJobs } from "@/services/job.service";
import { createSupabaseAdminClient } from "@/supabase/admin";

export async function getAdminOverview() {
  const [jobs, analytics, backend] = await Promise.all([getJobs(), getAnalyticsSummary(), getBackendStatus()]);
  const supabase = createSupabaseAdminClient();
  let failedCrawlers = 0;
  let brokenLinks = 0;
  let expiredJobs = 0;
  if (supabase) {
    const [failed, broken, expired] = await Promise.all([
      supabase.from("crawler_runs").select("id", { count: "exact", head: true }).eq("status", "failed"),
      supabase.from("broken_links").select("id", { count: "exact", head: true }).is("resolved_at", null),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", false)
    ]);
    failedCrawlers = failed.count ?? 0;
    brokenLinks = broken.count ?? 0;
    expiredJobs = expired.count ?? 0;
  }
  return {
    totalJobs: jobs.length + expiredJobs,
    activeJobs: jobs.length,
    expiredJobs,
    governmentJobs: jobs.filter((job) => job.categories.includes("Government")).length,
    privateJobs: jobs.filter((job) => job.categories.includes("Private")).length,
    failedCrawlers,
    brokenLinks,
    analytics,
    backend
  };
}
