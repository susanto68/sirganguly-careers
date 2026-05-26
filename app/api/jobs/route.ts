import { NextResponse } from "next/server";
import { getJobs } from "@/services/job.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const jobs = await getJobs({
    query: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    location: url.searchParams.get("location") ?? undefined,
    remote: url.searchParams.get("remote") === "true",
    fresher: url.searchParams.get("fresher") === "true",
    government: url.searchParams.get("government") === "true"
  });

  return NextResponse.json({ jobs });
}
