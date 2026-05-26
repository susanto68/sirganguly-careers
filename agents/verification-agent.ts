import type { ExtractedOpportunity, VerificationResult } from "@/types/agent";
import { trustedCompanies, trustedSourceRegistry } from "@/lib/source-registry";
import { createDuplicateKey } from "@/utils/dedupe";
import { isSuspiciousUrl, normalizeDomain, sameRegistrableDomain } from "@/utils/domains";

const trustedDomains = [
  ...trustedCompanies.map((company) => company.domain),
  ...trustedSourceRegistry.map((source) => source.domain),
  "greenhouse.io",
  "lever.co",
  "myworkdayjobs.com",
  "successfactors.com"
];

export function runVerificationAgent(opportunity: ExtractedOpportunity): VerificationResult {
  const sourceDomain = normalizeDomain(opportunity.sourceDomain || opportunity.sourceUrl);
  const applyDomain = normalizeDomain(opportunity.officialApplyUrl);
  const reasons: string[] = [];

  if (isSuspiciousUrl(opportunity.officialApplyUrl) || isSuspiciousUrl(opportunity.sourceUrl)) {
    reasons.push("Suspicious promotional or messaging-only URL pattern.");
  }

  const trustedDomain = trustedDomains.find((domain) => sameRegistrableDomain(sourceDomain, domain));
  if (!trustedDomain) {
    reasons.push("Source domain is not in the trusted registry.");
  }

  const sameDomain = sameRegistrableDomain(applyDomain, sourceDomain);
  const trustedApplyVendor = ["greenhouse.io", "lever.co", "myworkdayjobs.com", "successfactors.com"].some((domain) =>
    sameRegistrableDomain(applyDomain, domain)
  );

  if (!sameDomain && !trustedApplyVendor) {
    reasons.push("Apply URL does not match the official source domain or a trusted ATS vendor.");
  }

  const confidenceScore = Math.max(0, 98 - reasons.length * 22);

  return {
    status: reasons.length ? "review_required" : "verified",
    confidenceScore,
    reasons,
    normalizedDomain: sourceDomain,
    duplicateKey: createDuplicateKey(opportunity)
  };
}
