export type JobCategory =
  | "Government"
  | "Private"
  | "Internship"
  | "Freshers"
  | "Remote"
  | "Banking"
  | "Railway"
  | "Teaching"
  | "IT"
  | "Startup"
  | "International";

export type VerificationStatus = "verified" | "review_required" | "rejected";

export type Job = {
  id: string;
  title: string;
  companyId: string;
  company: string;
  companyLogo: string;
  companySlug: string;
  sourceUrl: string;
  officialApplyUrl: string;
  sourceDomain: string;
  location: string;
  country: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  eligibility: string;
  deadline?: string;
  openedAt: string;
  jobType: JobCategory;
  categories: JobCategory[];
  remote: boolean;
  fresher: boolean;
  verified: boolean;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  aiSummary: string;
  priorityScore: number;
  lastCheckedAt: string;
};

export type JobFilters = {
  query?: string;
  category?: string;
  location?: string;
  remote?: boolean;
  fresher?: boolean;
  internship?: boolean;
  government?: boolean;
};
