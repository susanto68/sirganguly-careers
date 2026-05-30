import type { ExtractedOpportunity, RawOpportunity } from "@/types/agent";
import { seedJobs } from "@/lib/jobs-data";
import { askGroq } from "@/services/groq.service";

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

  const discovered = await Promise.all(
    opportunities.map(async (item) => {
      let parsedJob: Partial<ExtractedOpportunity> = {};
      
      if (item.rawText) {
        try {
          parsedJob = JSON.parse(item.rawText);
        } catch {
          // Silent catch: not a JSON string, fallback to manual parsing or LLM refinement below
        }
      }

      // If we have parsed JSON, use its values immediately
      if (parsedJob.title) {
        return {
          title: parsedJob.title,
          company: parsedJob.company || item.company,
          location: parsedJob.location || "Official portal",
          country: parsedJob.country || "India",
          deadline: parsedJob.deadline,
          salaryMin: parsedJob.salaryMin,
          salaryMax: parsedJob.salaryMax,
          currency: parsedJob.currency,
          skills: parsedJob.skills || ["Official notification review"],
          eligibility: parsedJob.eligibility || "Open the official source and verify role-specific eligibility before applying.",
          officialApplyUrl: parsedJob.officialApplyUrl || item.url,
          sourceUrl: parsedJob.sourceUrl || item.url,
          sourceDomain: parsedJob.sourceDomain || item.sourceDomain,
          openedAt: parsedJob.openedAt || new Date().toISOString().slice(0, 10),
          remote: parsedJob.remote ?? false,
          fresher: parsedJob.fresher ?? false
        };
      }

      // If we don't have parsed JSON, but LLM is configured, we can extract details from unstructured text
      const systemPrompt = "You are a professional recruiting assistant. Extract the job details as JSON: {title: string, skills: string[], eligibility: string, remote: boolean, fresher: boolean} from the raw announcement. Return ONLY valid JSON.";
      const userPrompt = `Company: ${item.company}\nTitle: ${item.title}\nAnnouncement:\n${item.rawText || ""}`;
      
      const aiResponse = await askGroq(systemPrompt, userPrompt, 150);
      if (aiResponse) {
        try {
          const parsed = JSON.parse(aiResponse);
          return {
            title: parsed.title || item.title,
            company: item.company,
            location: "Official portal",
            country: "India",
            skills: parsed.skills || ["Official notification review"],
            eligibility: parsed.eligibility || "Open the official source and verify role-specific eligibility before applying.",
            officialApplyUrl: item.url,
            sourceUrl: item.url,
            sourceDomain: item.sourceDomain,
            openedAt: new Date().toISOString().slice(0, 10),
            remote: Boolean(parsed.remote),
            fresher: Boolean(parsed.fresher)
          };
        } catch {
          // Fallback to static mock on parse failure
        }
      }

      // Default safe fallback on error or offline
      return {
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
      };
    })
  );

  return [...seeded, ...discovered];
}
