import type { Job } from "@/types/job";
import { isEndingSoon } from "@/utils/dates";

export function buildJobNotifications(jobs: Job[]) {
  return jobs
    .filter((job) => isEndingSoon(job.deadline))
    .map((job) => ({
      id: `deadline-${job.id}`,
      title: `${job.title} closes soon`,
      body: `${job.company} application deadline is approaching. Apply only through the official source.`,
      jobId: job.id
    }));
}
