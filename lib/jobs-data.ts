import type { Job } from "@/types/job";
import { trustedCompanies } from "@/lib/source-registry";

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

const companyById = new Map(trustedCompanies.map((company) => [company.id, company]));

function job(input: Omit<Job, "company" | "companyLogo" | "companySlug" | "sourceDomain" | "verified" | "verificationStatus" | "lastCheckedAt">): Job {
  const company = companyById.get(input.companyId);
  if (!company) throw new Error(`Unknown company: ${input.companyId}`);

  return {
    ...input,
    company: company.name,
    companyLogo: company.logo,
    companySlug: company.slug,
    sourceDomain: company.domain,
    verified: true,
    verificationStatus: "verified",
    lastCheckedAt: new Date().toISOString()
  };
}

export const seedJobs: Job[] = [
  job({
    id: "job-tcs-fresher-engineer",
    title: "Fresher Software Engineer Program",
    companyId: "company-tcs",
    sourceUrl: "https://www.tcs.com/careers",
    officialApplyUrl: "https://www.tcs.com/careers",
    location: "Pan India",
    country: "India",
    skills: ["Java", "SQL", "Problem solving", "Communication"],
    eligibility: "Final year and recent graduates should verify eligibility on the official TCS careers page before applying.",
    deadline: daysFromNow(5),
    openedAt: daysAgo(2),
    jobType: "Freshers",
    categories: ["Private", "Freshers", "IT"],
    remote: false,
    fresher: true,
    confidenceScore: 94,
    aiSummary: "Good fresher-friendly technology opportunity. Check the official TCS careers page for batch, degree, and test details before submitting.",
    priorityScore: 96
  }),
  job({
    id: "job-infosys-systems-associate",
    title: "Systems Associate - Entry Level",
    companyId: "company-infosys",
    sourceUrl: "https://www.infosys.com/careers/",
    officialApplyUrl: "https://www.infosys.com/careers/",
    location: "Bengaluru, Pune, Hyderabad",
    country: "India",
    skills: ["Programming fundamentals", "Aptitude", "SDLC", "Teamwork"],
    eligibility: "Entry-level applicants should confirm eligible branches, graduation year, and selection steps on Infosys Careers.",
    deadline: daysFromNow(12),
    openedAt: daysAgo(4),
    jobType: "IT",
    categories: ["Private", "Freshers", "IT"],
    remote: false,
    fresher: true,
    confidenceScore: 92,
    aiSummary: "Suitable for students seeking an IT services role. The official careers page is the only apply route shown here.",
    priorityScore: 88
  }),
  job({
    id: "job-microsoft-internship",
    title: "Software Engineering Internship",
    companyId: "company-microsoft",
    sourceUrl: "https://jobs.careers.microsoft.com/global/en/search",
    officialApplyUrl: "https://jobs.careers.microsoft.com/global/en/search",
    location: "Hyderabad / Bengaluru",
    country: "India",
    salaryMin: 0,
    currency: "INR",
    skills: ["Data structures", "Algorithms", "Cloud", "TypeScript"],
    eligibility: "Students enrolled in a relevant degree should verify graduation timelines and location requirements on Microsoft Careers.",
    deadline: daysFromNow(3),
    openedAt: daysAgo(1),
    jobType: "Internship",
    categories: ["Internship", "IT", "International"],
    remote: false,
    fresher: true,
    confidenceScore: 96,
    aiSummary: "High-trust internship listing source. Apply only after confirming exact role ID and eligibility on Microsoft Careers.",
    priorityScore: 99
  }),
  job({
    id: "job-google-cloud-resident",
    title: "Cloud Technical Resident",
    companyId: "company-google",
    sourceUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    officialApplyUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    location: "Bengaluru / Gurgaon",
    country: "India",
    skills: ["Cloud computing", "Linux", "Networking", "Customer empathy"],
    eligibility: "Early-career candidates should check degree, experience, and location requirements on Google Careers.",
    deadline: daysFromNow(18),
    openedAt: daysAgo(6),
    jobType: "IT",
    categories: ["Private", "Freshers", "IT", "International"],
    remote: false,
    fresher: true,
    confidenceScore: 95,
    aiSummary: "Strong early-career cloud pathway. Read the official job page carefully for role ID, travel, and work authorization details.",
    priorityScore: 84
  }),
  job({
    id: "job-sbi-junior-associate",
    title: "Junior Associate Recruitment Notice",
    companyId: "company-sbi",
    sourceUrl: "https://sbi.co.in/web/careers",
    officialApplyUrl: "https://sbi.co.in/web/careers",
    location: "India",
    country: "India",
    skills: ["Banking awareness", "Quantitative aptitude", "Reasoning", "Customer service"],
    eligibility: "Applicants must verify age, education, local language, fee, and exam dates on the official SBI careers notice.",
    deadline: daysFromNow(7),
    openedAt: daysAgo(3),
    jobType: "Banking",
    categories: ["Government", "Banking", "Freshers"],
    remote: false,
    fresher: true,
    confidenceScore: 93,
    aiSummary: "Official public-sector banking opportunity source. Use only the SBI Careers portal and read the notification PDF before paying any fee.",
    priorityScore: 97
  }),
  job({
    id: "job-upsc-recruitment",
    title: "Government Recruitment Notification",
    companyId: "company-upsc",
    sourceUrl: "https://upsc.gov.in/recruitment",
    officialApplyUrl: "https://upsc.gov.in/recruitment",
    location: "India",
    country: "India",
    skills: ["General studies", "Subject knowledge", "Document verification"],
    eligibility: "Check the exact post notification, age limits, education, reservation rules, and closing date on UPSC before applying.",
    deadline: daysFromNow(6),
    openedAt: daysAgo(5),
    jobType: "Government",
    categories: ["Government"],
    remote: false,
    fresher: false,
    confidenceScore: 91,
    aiSummary: "Official government recruitment source. Students should confirm the exact notification number and eligibility on UPSC.",
    priorityScore: 95
  })
];

export const categorySlugs = [
  { slug: "government-jobs", label: "Government Jobs", category: "Government" },
  { slug: "private-jobs", label: "Private Jobs", category: "Private" },
  { slug: "internship", label: "Internship", category: "Internship" },
  { slug: "remote-jobs", label: "Remote Jobs", category: "Remote" },
  { slug: "banking", label: "Banking", category: "Banking" },
  { slug: "railway", label: "Railway", category: "Railway" },
  { slug: "it-companies", label: "IT Companies", category: "IT" },
  { slug: "teaching-jobs", label: "Teaching Jobs", category: "Teaching" },
  { slug: "abroad-jobs", label: "Abroad Jobs", category: "International" }
] as const;
