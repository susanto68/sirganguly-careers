"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, SlidersHorizontal } from "lucide-react";
import type { Job } from "@/types/job";
import { recommendJobs, type StudentProfile, type RecommendedJob } from "@/services/recommendation.service";
import { JobGrid } from "@/components/jobs/job-grid";
import { ProfileModal } from "@/components/dashboard/profile-modal";

export function DashboardRecommender({ jobs }: { jobs: Job[] }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProfileAndRun = () => {
    const stored = localStorage.getItem("student_profile");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as StudentProfile;
        setProfile(parsed);
        const results = recommendJobs(jobs, parsed);
        setRecommendedJobs(results.slice(0, 6));
      } catch {
        // Fallback
      }
    } else {
      // Default: map fresher jobs with mock recommended score if no profile set yet
      const defaultRecommendations = jobs
        .filter((job) => job.fresher)
        .slice(0, 6)
        .map((job) => ({
          ...job,
          relevanceScore: 75,
          matchType: "Recommended" as const
        }));
      setRecommendedJobs(defaultRecommendations);
    }
  };

  useEffect(() => {
    loadProfileAndRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs]);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    const results = recommendJobs(jobs, newProfile);
    setRecommendedJobs(results.slice(0, 6));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
            {profile ? "AI Personal Matching" : "Freshers First"}
          </p>
          <h2 className="mt-2 text-3xl font-black">
            {profile ? "Best student-friendly picks for you" : "Best student-friendly picks"}
          </h2>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 hover:border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 shadow-card transition dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800 self-start sm:self-center"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {profile ? "Customize Matcher" : "Match My Skills"}
        </button>
      </div>

      {!profile && (
        <div className="rounded-xl border border-dashed border-emerald-500/35 bg-emerald-500/5 p-4 text-sm text-emerald-950 dark:text-emerald-100 flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Configure your profile to score, prioritize, and find roles customized to your exact skills.</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
          >
            Setup Profile Now &rarr;
          </button>
        </div>
      )}

      <JobGrid jobs={recommendedJobs} />

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
