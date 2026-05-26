import type { Job, JobCategory, VerificationStatus } from "@/types/job";

export type RawOpportunity = {
  title: string;
  company: string;
  url: string;
  sourceDomain: string;
  rawText?: string;
};

export type ExtractedOpportunity = {
  title: string;
  company: string;
  location?: string;
  country?: string;
  deadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  eligibility?: string;
  officialApplyUrl: string;
  sourceUrl: string;
  sourceDomain: string;
  openedAt?: string;
  remote?: boolean;
  fresher?: boolean;
};

export type VerificationResult = {
  status: VerificationStatus;
  confidenceScore: number;
  reasons: string[];
  normalizedDomain: string;
  duplicateKey: string;
};

export type CategorizationResult = {
  primaryCategory: JobCategory;
  categories: JobCategory[];
};

export type AgentPipelineResult = {
  jobs: Job[];
  rejected: Array<{
    opportunity: RawOpportunity | ExtractedOpportunity;
    reasons: string[];
  }>;
};
