import type { AgentPipelineResult } from "@/types/agent";
import { trustedCompanies } from "@/lib/source-registry";
import { runCategorizationAgent } from "@/agents/categorization-agent";
import { runExtractionAgent } from "@/agents/extraction-agent";
import { runRankingAgent } from "@/agents/ranking-agent";
import { runSearchAgent } from "@/agents/search-agent";
import { runSummaryAgent } from "@/agents/summary-agent";
import { runVerificationAgent } from "@/agents/verification-agent";
import { normalizeDomain } from "@/utils/domains";

export async function runAgentPipeline(): Promise<AgentPipelineResult> {
  const raw = await runSearchAgent();
  const extracted = await runExtractionAgent(raw);
  const rejected: AgentPipelineResult["rejected"] = [];
  const seen = new Set<string>();
  const jobs = [];

  for (const opportunity of extracted) {
    const verification = runVerificationAgent(opportunity);
    if (verification.status !== "verified" || seen.has(verification.duplicateKey)) {
      rejected.push({
        opportunity,
        reasons: seen.has(verification.duplicateKey) ? ["Duplicate listing detected."] : verification.reasons
      });
      continue;
    }

    seen.add(verification.duplicateKey);
    const categorization = runCategorizationAgent(opportunity);
    const company = trustedCompanies.find((item) => item.name === opportunity.company || normalizeDomain(item.domain) === verification.normalizedDomain);
    const priorityScore = runRankingAgent(opportunity, verification);
    const aiSummary = await runSummaryAgent(opportunity);

    jobs.push({
      id: verification.duplicateKey,
      title: opportunity.title,
      companyId: company?.id ?? verification.normalizedDomain,
      company: opportunity.company,
      companyLogo: company?.logo || `https://logo.clearbit.com/${verification.normalizedDomain}`,
      companySlug: company?.slug ?? verification.normalizedDomain.replace(/\./g, "-"),
      sourceUrl: opportunity.sourceUrl,
      officialApplyUrl: opportunity.officialApplyUrl,
      sourceDomain: verification.normalizedDomain,
      location: opportunity.location ?? "Not specified",
      country: opportunity.country ?? "India",
      salaryMin: opportunity.salaryMin,
      salaryMax: opportunity.salaryMax,
      currency: opportunity.currency,
      skills: opportunity.skills,
      eligibility: opportunity.eligibility ?? "Check the official source before applying.",
      deadline: opportunity.deadline,
      openedAt: opportunity.openedAt ?? new Date().toISOString().slice(0, 10),
      jobType: categorization.primaryCategory,
      categories: categorization.categories,
      remote: Boolean(opportunity.remote),
      fresher: Boolean(opportunity.fresher),
      verified: true,
      verificationStatus: verification.status,
      confidenceScore: verification.confidenceScore,
      aiSummary,
      priorityScore,
      lastCheckedAt: new Date().toISOString()
    });
  }

  return { jobs, rejected };
}
