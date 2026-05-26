import type { RawOpportunity } from "@/types/agent";
import { trustedSourceRegistry } from "@/lib/source-registry";

export async function runSearchAgent(): Promise<RawOpportunity[]> {
  return trustedSourceRegistry.slice(0, 6).map((source) => ({
    title: `${source.name} verified careers source`,
    company: source.name,
    url: source.url,
    sourceDomain: source.domain,
    rawText: `Official ${source.type} opportunity source from ${source.name}.`
  }));
}
