import type { Job } from "@/types/job";
import { isEndingSoon, isNewOpening } from "@/utils/dates";

export function rankJobs(jobs: Job[]) {
  return [...jobs].sort((a, b) => {
    const scoreA = a.priorityScore + (isEndingSoon(a.deadline) ? 20 : 0) + (isNewOpening(a.openedAt) ? 8 : 0);
    const scoreB = b.priorityScore + (isEndingSoon(b.deadline) ? 20 : 0) + (isNewOpening(b.openedAt) ? 8 : 0);
    return scoreB - scoreA;
  });
}
