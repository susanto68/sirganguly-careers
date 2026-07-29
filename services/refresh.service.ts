import { runAgentPipeline } from "@/agents/agent-orchestrator";
import { trustedCompanies } from "@/lib/source-registry";
import { createSupabaseAdminClient } from "@/supabase/admin";

function sourceSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function runDailyRefresh() {
  const startedAt = new Date().toISOString();
  const result = await runAgentPipeline();
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return {
      mode: "dry-run",
      discovered: result.jobs.length,
      inserted: 0,
      updated: 0,
      expired: 0,
      rejected: result.rejected.length,
      message: "Supabase is not configured, so the refresh pipeline ran without writing to the database."
    };
  }

  const companyRecords = Array.from(new Map(result.jobs.map((job) => {
    const registered = trustedCompanies.find((company) => company.slug === job.companySlug || company.name === job.company);
    const slug = registered?.slug ?? sourceSlug(job.company);
    return [slug, {
      name: job.company,
      slug,
      logo: registered?.logo ?? job.companyLogo,
      career_url: registered?.careerUrl ?? job.sourceUrl,
      domain: job.sourceDomain,
      verified: job.verified,
      category: registered?.category ?? job.jobType,
      description: registered?.description ?? "Official opportunity source added by the verified refresh pipeline.",
      headquarters: registered?.headquarters ?? null,
      updated_at: new Date().toISOString()
    }];
  })).values());
  const { data: savedCompanies, error: companyError } = companyRecords.length
    ? await supabase.from("companies").upsert(companyRecords, { onConflict: "slug" }).select("id, slug")
    : { data: [], error: null };
  if (companyError) throw companyError;
  const companyIds = new Map((savedCompanies ?? []).map((company) => [String(company.slug), String(company.id)]));

  const rows = result.jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company_id: companyIds.get(trustedCompanies.find((company) => company.slug === job.companySlug || company.name === job.company)?.slug ?? sourceSlug(job.company)) ?? null,
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
    duplicate_key: job.id,
    ai_summary: job.aiSummary,
    priority_score: job.priorityScore,
    is_active: true,
    last_checked_at: job.lastCheckedAt,
    updated_at: new Date().toISOString()
  }));

  const ids = rows.map((row) => row.id);
  const { data: existing } = ids.length
    ? await supabase.from("jobs").select("id").in("id", ids)
    : { data: [] };
  const existingIds = new Set((existing ?? []).map((row) => String(row.id)));
  const inserted = rows.filter((row) => !existingIds.has(row.id)).length;
  const updated = rows.length - inserted;

  const { error } = await supabase.from("jobs").upsert(rows, { onConflict: "id" });
  const today = new Date().toISOString().slice(0, 10);
  const { data: expiredRows, error: expiryError } = await supabase
    .from("jobs")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("is_active", true)
    .lt("deadline", today)
    .select("id");
  const expired = expiredRows?.length ?? 0;
  const finalError = error ?? expiryError;
  await supabase.from("refresh_logs").insert({
    status: finalError ? "failed" : "success",
    inserted_count: finalError ? 0 : inserted,
    updated_count: finalError ? 0 : updated,
    expired_count: finalError ? 0 : expired,
    rejected_count: result.rejected.length,
    message: finalError?.message ?? `Daily refresh completed. Started ${startedAt}.`
  });

  if (finalError) throw finalError;

  return {
    mode: "database",
    discovered: rows.length,
    inserted,
    updated,
    expired,
    rejected: result.rejected.length,
    message: "Daily refresh completed and Supabase was updated."
  };
}
