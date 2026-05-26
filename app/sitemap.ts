import type { MetadataRoute } from "next";
import { categorySlugs } from "@/lib/jobs-data";
import { getCompanies } from "@/services/company.service";
import { getJobs } from "@/services/job.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const [jobs, companies] = await Promise.all([getJobs(), getCompanies()]);

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/jobs`, lastModified: new Date() },
    { url: `${baseUrl}/dashboard`, lastModified: new Date() },
    ...categorySlugs.map((category) => ({ url: `${baseUrl}/category/${category.slug}`, lastModified: new Date() })),
    ...jobs.map((job) => ({ url: `${baseUrl}/jobs/${job.id}`, lastModified: new Date(job.lastCheckedAt) })),
    ...companies.map((company) => ({ url: `${baseUrl}/company/${company.slug}`, lastModified: new Date() }))
  ];
}
