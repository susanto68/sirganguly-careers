import { NextResponse } from "next/server";
import { getBackendStatus } from "@/services/backend-status.service";
import { searchJobs } from "@/services/search.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filters = {
    query: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
    remote: url.searchParams.get("remote") === "true",
    fresher: url.searchParams.get("fresher") === "true"
  };
  const [jobs, status] = await Promise.all([searchJobs(filters), getBackendStatus()]);

  return NextResponse.json({
    query: url.searchParams.get("q") ?? "",
    count: jobs.length,
    mode: status.mode,
    search: status.search,
    jobs
  });
}
