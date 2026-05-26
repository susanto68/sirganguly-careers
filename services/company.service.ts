import { trustedCompanies } from "@/lib/source-registry";

export async function getCompanies() {
  return trustedCompanies;
}

export async function getCompanyBySlug(slug: string) {
  return trustedCompanies.find((company) => company.slug === slug);
}
