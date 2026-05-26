import type { ExtractedOpportunity } from "@/types/agent";

export async function runSummaryAgent(opportunity: ExtractedOpportunity) {
  const skills = opportunity.skills.length ? opportunity.skills.slice(0, 3).join(", ") : "the listed skills";
  const deadline = opportunity.deadline ? ` The listed deadline is ${opportunity.deadline}.` : " No official deadline was extracted.";

  return `${opportunity.company} is linked through an official source for ${opportunity.title}. Students should review ${skills}, eligibility, and documents on the official page before applying.${deadline}`;
}
