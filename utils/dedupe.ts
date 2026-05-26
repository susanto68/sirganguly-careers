import type { ExtractedOpportunity } from "@/types/agent";
import { normalizeDomain } from "@/utils/domains";

export function createDuplicateKey(job: Pick<ExtractedOpportunity, "title" | "company" | "sourceDomain">) {
  return [job.title, job.company, normalizeDomain(job.sourceDomain)]
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
