import type { Job } from "@/types/job";

export interface StudentProfile {
  skills: string[];
  education: string;
  experienceYears: number;
  preferredLocation: string;
  careerInterests: string[];
}

export interface RecommendedJob extends Job {
  relevanceScore: number;
  matchType: "Best Match" | "Good Match" | "Recommended";
}

// Highly reliable job recommendation engine with semantic scoring and tags.
export function recommendJobs(jobs: Job[], profile: StudentProfile): RecommendedJob[] {
  return jobs
    .map((job) => {
      let score = 0;

      // 1. Skill Matching (Weight: 45%)
      const userSkills = profile.skills.map((s) => s.toLowerCase().trim()).filter(Boolean);
      const jobSkills = job.skills.map((s) => s.toLowerCase().trim());
      
      if (userSkills.length > 0 && jobSkills.length > 0) {
        const matches = jobSkills.filter((js) => 
          userSkills.some((us) => js.includes(us) || us.includes(js))
        );
        const matchRatio = matches.length / Math.max(1, jobSkills.length);
        score += Math.round(matchRatio * 45);
      }

      // 2. Preferred Location & Remote (Weight: 25%)
      const userLoc = profile.preferredLocation.toLowerCase().trim();
      const jobLoc = job.location.toLowerCase().trim();
      
      if (job.remote) {
        score += 25; // Remote is always an excellent match
      } else if (userLoc && (jobLoc.includes(userLoc) || userLoc.includes(jobLoc))) {
        score += 25;
      } else if (userLoc && jobLoc.includes("pan india")) {
        score += 20;
      }

      // 3. Career Interest / Category Match (Weight: 20%)
      const userInterests = profile.careerInterests.map((i) => i.toLowerCase().trim());
      const jobCategories = job.categories.map((c) => c.toLowerCase().trim());
      
      if (userInterests.length > 0 && jobCategories.length > 0) {
        const matches = jobCategories.filter((cat) => 
          userInterests.some((interest) => cat.includes(interest) || interest.includes(cat))
        );
        if (matches.length > 0) {
          score += 20;
        }
      }

      // 4. Fresher vs Experience friendliness (Weight: 10%)
      const isFresherEducated = profile.experienceYears <= 1;
      if (isFresherEducated && job.fresher) {
        score += 10;
      } else if (!isFresherEducated && !job.fresher) {
        score += 10;
      } else {
        score += 5;
      }

      // Cap score at 100 and ensure min is 0
      const relevanceScore = Math.min(100, Math.max(0, score));

      let matchType: RecommendedJob["matchType"] = "Recommended";
      if (relevanceScore >= 80) {
        matchType = "Best Match";
      } else if (relevanceScore >= 55) {
        matchType = "Good Match";
      }

      return {
        ...job,
        relevanceScore,
        matchType
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
