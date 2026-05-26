import { NextResponse } from "next/server";
import { searchJobs } from "@/services/search.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobs = await searchJobs({
    query: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
    remote: url.searchParams.get("remote") === "true",
    fresher: url.searchParams.get("fresher") === "true"
  });

  return NextResponse.json({
    query: url.searchParams.get("q") ?? "",
    count: jobs.length,
    jobs
  });
}
