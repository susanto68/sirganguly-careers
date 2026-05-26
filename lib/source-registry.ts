import type { Company } from "@/types/company";

export const trustedCompanies: Company[] = [
  {
    id: "company-tcs",
    name: "Tata Consultancy Services",
    slug: "tata-consultancy-services",
    logo: "https://logo.clearbit.com/tcs.com",
    careerUrl: "https://www.tcs.com/careers",
    domain: "tcs.com",
    verified: true,
    category: "Private",
    headquarters: "Mumbai, India",
    description: "Large technology services employer with graduate and experienced hiring programs."
  },
  {
    id: "company-infosys",
    name: "Infosys",
    slug: "infosys",
    logo: "https://logo.clearbit.com/infosys.com",
    careerUrl: "https://www.infosys.com/careers/",
    domain: "infosys.com",
    verified: true,
    category: "Private",
    headquarters: "Bengaluru, India",
    description: "Global digital services company with fresher, internship, and technology roles."
  },
  {
    id: "company-microsoft",
    name: "Microsoft",
    slug: "microsoft",
    logo: "https://logo.clearbit.com/microsoft.com",
    careerUrl: "https://jobs.careers.microsoft.com/global/en/search",
    domain: "microsoft.com",
    verified: true,
    category: "International",
    headquarters: "Redmond, United States",
    description: "Global technology company offering engineering, product, support, and internship roles."
  },
  {
    id: "company-google",
    name: "Google",
    slug: "google",
    logo: "https://logo.clearbit.com/google.com",
    careerUrl: "https://www.google.com/about/careers/applications/jobs/results/",
    domain: "google.com",
    verified: true,
    category: "International",
    headquarters: "Mountain View, United States",
    description: "Technology company with verified student, internship, and graduate opportunities."
  },
  {
    id: "company-sbi",
    name: "State Bank of India",
    slug: "state-bank-of-india",
    logo: "https://logo.clearbit.com/sbi.co.in",
    careerUrl: "https://sbi.co.in/web/careers",
    domain: "sbi.co.in",
    verified: true,
    category: "Government",
    headquarters: "Mumbai, India",
    description: "Public sector bank publishing recruitment notices through its official careers portal."
  },
  {
    id: "company-upsc",
    name: "Union Public Service Commission",
    slug: "union-public-service-commission",
    logo: "https://logo.clearbit.com/upsc.gov.in",
    careerUrl: "https://upsc.gov.in/recruitment",
    domain: "upsc.gov.in",
    verified: true,
    category: "Government",
    headquarters: "New Delhi, India",
    description: "Official government recruitment body for central government examinations and notices."
  }
];

export const trustedSourceRegistry = [
  ...trustedCompanies.map((company) => ({
    name: company.name,
    domain: company.domain,
    url: company.careerUrl,
    type: company.category
  })),
  {
    name: "National Career Service",
    domain: "ncs.gov.in",
    url: "https://www.ncs.gov.in/",
    type: "Government"
  },
  {
    name: "AICTE Internship Portal",
    domain: "internship.aicte-india.org",
    url: "https://internship.aicte-india.org/",
    type: "Internship"
  }
];
