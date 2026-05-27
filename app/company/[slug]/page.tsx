import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CheckCircle2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/company-logo";
import { JobGrid } from "@/components/jobs/job-grid";
import { getCompanies, getCompanyBySlug } from "@/services/company.service";
import { getJobsByCompany } from "@/services/job.service";

type CompanyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const companies = await getCompanies();
  return companies.map((company) => ({ slug: company.slug }));
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  const jobs = await getJobsByCompany(company.slug);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="glass rounded-xl p-5 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <CompanyLogo src={company.logo} name={company.name} size="lg" />
            <div>
              <Badge tone={company.category === "Government" ? "amber" : "emerald"}>{company.category}</Badge>
              <h1 className="mt-3 text-4xl font-black">{company.name}</h1>
              <div className="mt-2 flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified domain</span>
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-coral" /> {company.headquarters}</span>
              </div>
            </div>
          </div>
          <a
            href={company.careerUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-700"
          >
            Official careers page
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-6 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">{company.description}</p>
      </div>

      <div className="mt-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Open positions</p>
            <h2 className="mt-2 text-3xl font-black">Verified roles from {company.name}</h2>
          </div>
          <Link href="/jobs" className="text-sm font-black text-emerald-700 dark:text-emerald-300">All jobs</Link>
        </div>
        <JobGrid jobs={jobs} />
      </div>
    </section>
  );
}
