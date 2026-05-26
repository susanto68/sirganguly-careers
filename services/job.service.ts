import type { Job, JobFilters } from "@/types/job";
import { seedJobs } from "@/lib/jobs-data";
import { createSupabaseAdminClient } from "@/supabase/admin";
import { isExpired } from "@/utils/dates";

function mapDatabaseJob(row: Record<string, unknown>): Job {
  return {
    id: String(row.id),
    title: String(row.title),
    companyId: String(row.company_id ?? ""),
    company: String(row.company_name ?? row.company ?? "Verified source"),
    companyLogo: String(row.company_logo ?? ""),
    companySlug: String(row.company_slug ?? ""),
    sourceUrl: String(row.source_url),
    officialApplyUrl: String(row.official_apply_url),
    sourceDomain: String(row.source_domain),
    location: String(row.location ?? "Not specified"),
    country: String(row.country ?? "India"),
    salaryMin: row.salary_min ? Number(row.salary_min) : undefined,
    salaryMax: row.salary_max ? Number(row.salary_max) : undefined,
    currency: row.currency ? String(row.currency) : undefined,
    skills: Array.isArray(row.skills) ? (row.skills as string[]) : [],
    eligibility: String(row.eligibility ?? "Check the official notification before applying."),
    deadline: row.deadline ? String(row.deadline) : undefined,
    openedAt: String(row.opened_at ?? row.created_at),
    jobType: String(row.job_type ?? "Private") as Job["jobType"],
    categories: Array.isArray(row.categories) ? (row.categories as Job["categories"]) : ["Private"],
    remote: Boolean(row.is_remote),
    fresher: Boolean(row.is_fresher),
    verified: Boolean(row.is_verified),
    verificationStatus: String(row.verification_status ?? "review_required") as Job["verificationStatus"],
    confidenceScore: Number(row.confidence_score ?? 0),
    aiSummary: String(row.ai_summary ?? ""),
    priorityScore: Number(row.priority_score ?? 0),
    lastCheckedAt: String(row.last_checked_at ?? row.updated_at ?? new Date().toISOString())
  };
}

export async function getJobs(filters: JobFilters = {}) {
  const supabase = createSupabaseAdminClient();

  if (supabase) {
    let query = supabase
      .from("jobs")
      .select(
        "*, companies:company_id(name, slug, logo)"
      )
      .eq("is_active", true)
      .order("priority_score", { ascending: false })
      .limit(80);

    if (filters.category) query = query.contains("categories", [filters.category]);
    if (filters.remote) query = query.eq("is_remote", true);
    if (filters.fresher) query = query.eq("is_fresher", true);
    if (filters.government) query = query.contains("categories", ["Government"]);

    const { data, error } = await query;
    if (!error && data) {
      const mapped = data.map((row) => {
        const company = row.companies as { name?: string; slug?: string; logo?: string } | null;
        return mapDatabaseJob({
          ...row,
          company_name: company?.name,
          company_slug: company?.slug,
          company_logo: company?.logo
        });
      });
      return filterJobs(mapped, filters);
    }
  }

  return filterJobs(seedJobs, filters);
}

export async function getJobById(id: string) {
  const jobs = await getJobs();
  return jobs.find((job) => job.id === id);
}

export async function getJobsByCompany(slug: string) {
  const jobs = await getJobs();
  return jobs.filter((job) => job.companySlug === slug);
}

export function filterJobs(jobs: Job[], filters: JobFilters = {}) {
  const query = filters.query?.trim().toLowerCase();

  return jobs
    .filter((job) => job.verified && !isExpired(job.deadline))
    .filter((job) => {
      if (!query) return true;
      return [job.title, job.company, job.location, job.skills.join(" "), job.aiSummary, job.categories.join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(query);
    })
    .filter((job) => !filters.category || job.categories.includes(filters.category as Job["categories"][number]))
    .filter((job) => !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase()))
    .filter((job) => !filters.remote || job.remote)
    .filter((job) => !filters.fresher || job.fresher)
    .filter((job) => !filters.internship || job.categories.includes("Internship"))
    .filter((job) => !filters.government || job.categories.includes("Government"))
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
