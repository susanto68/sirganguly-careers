"use client";

import { useEffect, useState } from "react";

export function useSavedJobs() {
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    setSavedJobs(JSON.parse(localStorage.getItem("savedJobs") || "[]") as string[]);
  }, []);

  function toggle(jobId: string) {
    const next = savedJobs.includes(jobId) ? savedJobs.filter((id) => id !== jobId) : [...savedJobs, jobId];
    localStorage.setItem("savedJobs", JSON.stringify(next));
    setSavedJobs(next);
  }

  return { savedJobs, toggle };
}
