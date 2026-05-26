import type { Job } from "@/types/job";

export function keywordSearch(jobs: Job[], query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return jobs
    .map((job) => {
      const haystack = [job.title, job.company, job.location, job.skills.join(" "), job.categories.join(" "), job.aiSummary]
        .join(" ")
        .toLowerCase();
      return {
        job,
        score: terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0)
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.job);
}
