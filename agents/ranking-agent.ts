import type { ExtractedOpportunity, VerificationResult } from "@/types/agent";
import { differenceInCalendarDays, parseISO } from "date-fns";

export function runRankingAgent(opportunity: ExtractedOpportunity, verification: VerificationResult) {
  let score = verification.confidenceScore;

  if (opportunity.deadline) {
    const daysLeft = differenceInCalendarDays(parseISO(opportunity.deadline), new Date());
    if (daysLeft >= 0 && daysLeft <= 7) score += 24;
    if (daysLeft > 7 && daysLeft <= 21) score += 8;
  }

  if (opportunity.openedAt) {
    const daysOld = differenceInCalendarDays(new Date(), parseISO(opportunity.openedAt));
    if (daysOld <= 7) score += 12;
  }

  if (opportunity.fresher) score += 10;
  if (opportunity.remote) score += 4;

  return Math.min(100, Math.round(score));
}
