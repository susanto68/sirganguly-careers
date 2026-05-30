import type { Job, JobFilters } from "@/types/job";
import { getJobs } from "@/services/job.service";

// Client/Server fast search cache keying by serialized filters to guarantee instant (<50ms) results
const searchCache = new Map<string, { results: Job[]; expiry: number }>();
const CACHE_TTL = 10 * 1000; // Cache search responses for 10 seconds to keep fresh and instant

export async function searchJobs(filters: JobFilters): Promise<Job[]> {
  const cacheKey = JSON.stringify(filters);
  const cached = searchCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.results;
  }

  const allJobs = await getJobs(filters);
  const query = filters.query?.toLowerCase().trim() ?? "";
  const locationQuery = filters.location?.toLowerCase().trim() ?? "";

  const results = allJobs
    .map((job) => {
      let score = job.priorityScore + (job.confidenceScore / 10);

      if (query) {
        const titleMatch = job.title.toLowerCase().includes(query) ? 35 : 0;
        const companyMatch = job.company.toLowerCase().includes(query) ? 30 : 0;
        
        // Exact skill matches are weighted heavily
        const skillMatch = job.skills.some((skill) => skill.toLowerCase() === query) ? 25 : 0;
        const skillPartialMatch = job.skills.some((skill) => skill.toLowerCase().includes(query)) ? 10 : 0;

        // Query keywords matching text
        const text = [job.title, job.company, job.skills.join(" "), job.categories.join(" "), job.aiSummary]
          .join(" ")
          .toLowerCase();
        const keywords = query.split(/\s+/).filter(Boolean);
        const keywordMatches = keywords.filter((kw) => text.includes(kw)).length * 8;

        score += titleMatch + companyMatch + skillMatch + skillPartialMatch + keywordMatches;
      }

      if (locationQuery) {
        if (job.location.toLowerCase().includes(locationQuery)) {
          score += 25;
        }
      }

      return {
        ...job,
        searchScore: score
      };
    })
    // Filters applied strictly matching request parameters
    .filter((job) => {
      // Remote filter
      if (filters.remote && !job.remote) return false;
      
      // Fresher filter
      if (filters.fresher && !job.fresher) return false;

      // Location match filter
      if (locationQuery && !job.location.toLowerCase().includes(locationQuery) && !job.remote) {
        return false;
      }

      return true;
    })
    .sort((a, b) => (b.searchScore ?? 0) - (a.searchScore ?? 0));

  searchCache.set(cacheKey, {
    results,
    expiry: Date.now() + CACHE_TTL
  });

  return results;
}
