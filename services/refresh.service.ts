import { runAgentPipeline } from "@/agents/agent-orchestrator";
import { createSupabaseAdminClient } from "@/supabase/admin";

export async function runDailyRefresh() {
  const result = await runAgentPipeline();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      mode: "dry-run",
      inserted: result.jobs.length,
      rejected: result.rejected.length,
      message: "Supabase is not configured, so the refresh pipeline ran without writing to the database."
    };
  }

  const rows = result.jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company_id: job.companyId,
    source_url: job.sourceUrl,
    official_apply_url: job.officialApplyUrl,
    source_domain: job.sourceDomain,
    location: job.location,
    country: job.country,
    salary_min: job.salaryMin,
    salary_max: job.salaryMax,
    currency: job.currency,
    skills: job.skills,
    eligibility: job.eligibility,
    deadline: job.deadline,
    opened_at: job.openedAt,
    job_type: job.jobType,
    categories: job.categories,
    is_remote: job.remote,
    is_fresher: job.fresher,
    is_verified: job.verified,
    verification_status: job.verificationStatus,
    confidence_score: job.confidenceScore,
    ai_summary: job.aiSummary,
    priority_score: job.priorityScore,
    is_active: true,
    last_checked_at: job.lastCheckedAt,
    updated_at: new Date().toISOString()
  }));

  const { error } = await supabase.from("jobs").upsert(rows, { onConflict: "id" });
  await supabase.from("refresh_logs").insert({
    status: error ? "failed" : "success",
    inserted_count: error ? 0 : rows.length,
    rejected_count: result.rejected.length,
    message: error?.message ?? "Daily refresh completed."
  });

  if (error) throw error;

  return {
    mode: "database",
    inserted: rows.length,
    rejected: result.rejected.length,
    message: "Daily refresh completed and Supabase was updated."
  };
}
