import type { ExtractedOpportunity, RawOpportunity } from "@/types/agent";
import { seedJobs } from "@/lib/jobs-data";

export async function runExtractionAgent(opportunities: RawOpportunity[]): Promise<ExtractedOpportunity[]> {
  const seeded = seedJobs.map((job) => ({
    title: job.title,
    company: job.company,
    location: job.location,
    country: job.country,
    deadline: job.deadline,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    currency: job.currency,
    skills: job.skills,
    eligibility: job.eligibility,
    officialApplyUrl: job.officialApplyUrl,
    sourceUrl: job.sourceUrl,
    sourceDomain: job.sourceDomain,
    openedAt: job.openedAt,
    remote: job.remote,
    fresher: job.fresher
  }));

  const discovered = opportunities.map((item) => ({
    title: item.title,
    company: item.company,
    location: "Official portal",
    country: "India",
    skills: ["Official notification review"],
    eligibility: "Open the official source and verify role-specific eligibility before applying.",
    officialApplyUrl: item.url,
    sourceUrl: item.url,
    sourceDomain: item.sourceDomain,
    openedAt: new Date().toISOString().slice(0, 10),
    remote: false,
    fresher: false
  }));

  return [...seeded, ...discovered];
}
