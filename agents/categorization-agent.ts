import type { CategorizationResult, ExtractedOpportunity } from "@/types/agent";
import type { JobCategory } from "@/types/job";

export function runCategorizationAgent(opportunity: ExtractedOpportunity): CategorizationResult {
  const text = [opportunity.title, opportunity.company, opportunity.location, opportunity.skills.join(" ")]
    .join(" ")
    .toLowerCase();
  const categories = new Set<JobCategory>();

  if (text.includes("intern")) categories.add("Internship");
  if (text.includes("bank") || text.includes("sbi")) categories.add("Banking");
  if (text.includes("railway")) categories.add("Railway");
  if (text.includes("teacher") || text.includes("teaching")) categories.add("Teaching");
  if (text.includes("software") || text.includes("cloud") || text.includes("engineer") || text.includes("it")) categories.add("IT");
  if (opportunity.remote) categories.add("Remote");
  if (opportunity.fresher) categories.add("Freshers");
  if (text.includes("commission") || text.includes("government") || text.includes(".gov")) categories.add("Government");
  if (text.includes("microsoft") || text.includes("google")) categories.add("International");

  if (!categories.size) categories.add("Private");

  return {
    primaryCategory: Array.from(categories)[0],
    categories: Array.from(categories)
  };
}
