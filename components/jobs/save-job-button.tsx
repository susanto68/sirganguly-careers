"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]") as string[];
    setSaved(stored.includes(jobId));
  }, [jobId]);

  function toggle() {
    const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]") as string[];
    const next = stored.includes(jobId) ? stored.filter((id) => id !== jobId) : [...stored, jobId];
    localStorage.setItem("savedJobs", JSON.stringify(next));
    setSaved(next.includes(jobId));
  }

  return (
    <Button variant={saved ? "secondary" : "ghost"} size="icon" onClick={toggle} aria-label={saved ? "Remove saved job" : "Save job"} title={saved ? "Remove saved job" : "Save job"}>
      <Bookmark className={saved ? "h-4 w-4 fill-current text-emerald-600" : "h-4 w-4"} />
    </Button>
  );
}
