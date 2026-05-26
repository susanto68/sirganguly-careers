import type { JobFilters } from "@/types/job";
import { getJobs } from "@/services/job.service";

export async function searchJobs(filters: JobFilters) {
  const jobs = await getJobs(filters);
  const query = filters.query?.toLowerCase() ?? "";

  return jobs.map((job) => {
    const text = [job.title, job.company, job.skills.join(" "), job.categories.join(" "), job.aiSummary]
      .join(" ")
      .toLowerCase();
    const keywordScore = query ? query.split(/\s+/).filter((term) => text.includes(term)).length * 4 : 0;

    return {
      ...job,
      searchScore: job.priorityScore + keywordScore + job.confidenceScore / 10
    };
  }).sort((a, b) => b.searchScore - a.searchScore);
}
