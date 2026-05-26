import { NextResponse } from "next/server";
import { getCompanyBySlug } from "@/services/company.service";
import { getJobsByCompany } from "@/services/job.service";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const jobs = await getJobsByCompany(slug);
  return NextResponse.json({ company, jobs });
}
