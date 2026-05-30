import type { RawOpportunity } from "@/types/agent";
import { fetchLiveAggregatedJobs } from "@/services/aggregation.service";

export async function runSearchAgent(): Promise<RawOpportunity[]> {
  const liveJobs = await fetchLiveAggregatedJobs();
  return liveJobs.map((job) => ({
    title: job.title,
    company: job.company,
    url: job.officialApplyUrl,
    sourceDomain: job.sourceDomain,
    rawText: JSON.stringify(job)
  }));
}

