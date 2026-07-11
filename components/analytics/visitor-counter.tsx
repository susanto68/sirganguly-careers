"use client";

import { useEffect, useState } from "react";
import { Eye, Radio, Users } from "lucide-react";
import { trackFirebaseVisitors } from "@/firebase/visitor-counter";

type Summary = { totalVisitors: number; visitorsToday: number; onlineVisitors: number; totalPageViews: number; mode: string };

const previewStorageKey = "career-analytics-preview";

function nextPreviewSummary(): Summary {
  const today = new Date().toISOString().slice(0, 10);
  const stored = localStorage.getItem(previewStorageKey);
  const previous = stored ? JSON.parse(stored) as { date?: string; pageViews?: number } : {};
  const pageViews = previous.date === today ? (previous.pageViews ?? 0) + 1 : 1;
  localStorage.setItem(previewStorageKey, JSON.stringify({ date: today, pageViews }));
  return { totalVisitors: 1, visitorsToday: 1, onlineVisitors: 1, totalPageViews: pageViews, mode: "local-preview" };
}

export function VisitorCounter() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("career-session") ?? crypto.randomUUID();
    sessionStorage.setItem("career-session", sessionId);
    const preview = nextPreviewSummary();
    setSummary(preview);
    Promise.all([
      trackFirebaseVisitors(),
      fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, sessionId }),
      keepalive: true
      })
    ]).then(([firebaseVisitors]) => fetch("/api/analytics/summary")
      .then((response) => response.json())
      .then((data: Summary) => setSummary(data.mode === "database" ? data : firebaseVisitors && Number.isFinite(firebaseVisitors)
        ? { ...preview, totalVisitors: firebaseVisitors, mode: "firebase" }
        : preview))
      .catch(() => undefined));
  }, []);

  const items = [
    { label: "Total visitors", value: summary?.totalVisitors ?? 0, icon: Users },
    { label: "Today", value: summary?.visitorsToday ?? 0, icon: Eye },
    { label: "Online now", value: summary?.onlineVisitors ?? 0, icon: Radio },
    { label: "Page views", value: summary?.totalPageViews ?? 0, icon: Eye }
  ];

  return (
    <section className="border-y border-emerald-100 bg-white/70 px-4 py-5 dark:border-white/10 dark:bg-slate-950/45" aria-label="Privacy-friendly visitor statistics">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-3 dark:bg-slate-900">
            <Icon className="h-5 w-5 text-emerald-600" />
            <div><div className="text-xl font-black">{value.toLocaleString()}</div><div className="text-xs font-bold text-slate-500">{label}</div></div>
          </div>
        ))}
      </div>
      {summary?.mode === "firebase" && <p className="mx-auto mt-2 max-w-7xl text-xs text-slate-500">Shared visitor total powered by Firebase. Detailed daily analytics activate with Supabase.</p>}
      {summary?.mode === "local-preview" && <p className="mx-auto mt-2 max-w-7xl text-xs text-slate-500">Preview count for this browser. Add valid Firebase or Supabase credentials to enable site-wide visitor analytics.</p>}
    </section>
  );
}
