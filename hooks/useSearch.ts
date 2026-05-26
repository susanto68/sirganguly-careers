"use client";

import { useEffect, useState } from "react";
import type { Job } from "@/types/job";

export function useSearch(query: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setJobs([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { jobs?: Job[] }) => setJobs(data.jobs ?? []))
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [query]);

  return { jobs, loading };
}
