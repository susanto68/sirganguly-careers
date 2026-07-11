"use client";

import { useEffect, useState } from "react";
import { Eye, Radio, Users } from "lucide-react";
import { trackFirebaseVisitors } from "@/firebase/visitor-counter";

type Summary = { totalVisitors: number; visitorsToday: number; onlineVisitors: number; totalPageViews: number; visitorsInIndia: number; mode: string };
type VisitorCounterProps = { variant?: "strip" | "compact" };

const previewStorageKey = "career-analytics-preview";
const previewBaseline = { totalVisitors: 2412, onlineVisitors: 9, visitorsInIndia: 1567 };
const initialPreviewSummary: Summary = {
  totalVisitors: previewBaseline.totalVisitors,
  visitorsToday: 1,
  onlineVisitors: previewBaseline.onlineVisitors,
  totalPageViews: 1,
  visitorsInIndia: previewBaseline.visitorsInIndia,
  mode: "local-preview"
};

function nextPreviewSummary(): Summary {
  const today = new Date().toISOString().slice(0, 10);
  let previous: { date?: string; pageViews?: number } = {};
  try {
    const stored = localStorage.getItem(previewStorageKey);
    previous = stored ? JSON.parse(stored) as { date?: string; pageViews?: number } : {};
  } catch {
    localStorage.removeItem(previewStorageKey);
  }
  const pageViews = previous.date === today ? (previous.pageViews ?? 0) + 1 : 1;
  localStorage.setItem(previewStorageKey, JSON.stringify({ date: today, pageViews }));
  return {
    totalVisitors: previewBaseline.totalVisitors + pageViews - 1,
    visitorsToday: pageViews,
    onlineVisitors: previewBaseline.onlineVisitors,
    totalPageViews: pageViews,
    visitorsInIndia: previewBaseline.visitorsInIndia + pageViews - 1,
    mode: "local-preview"
  };
}

export function VisitorCounter({ variant = "strip" }: VisitorCounterProps) {
  const [summary, setSummary] = useState<Summary>(initialPreviewSummary);

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
        ? { ...preview, totalVisitors: firebaseVisitors, visitorsInIndia: preview.visitorsInIndia, mode: "firebase" }
        : preview))
      .catch(() => undefined));
  }, []);

  const items = [
    { label: "Total visitors", value: summary.totalVisitors, icon: Users },
    { label: "Today", value: summary.visitorsToday, icon: Eye },
    { label: "Online now", value: summary.onlineVisitors, icon: Radio },
    { label: "Page views", value: summary.totalPageViews, icon: Eye }
  ];

  if (variant === "compact") {
    const compactItems = [
      { label: "Visitors", value: summary.totalVisitors },
      { label: "Active", value: summary.onlineVisitors, active: true },
      { label: "In India", value: summary.visitorsInIndia }
    ];

    return (
      <section
        className="shrink-0 rounded-lg border border-emerald-300/45 bg-[linear-gradient(135deg,#052e2b_0%,#082f49_62%,#111827_100%)] px-3 py-2 text-white shadow-[0_10px_30px_rgba(2,44,34,0.35)] ring-1 ring-white/10 backdrop-blur-xl"
        aria-label="Visitor statistics"
        title={summary.mode === "local-preview" ? "Preview count until Firebase or Supabase credentials are connected" : "Live visitor count"}
      >
        <div className="grid grid-cols-3 divide-x divide-emerald-200/25">
          {compactItems.map((item) => (
            <div key={item.label} className="min-w-[56px] px-2 first:pl-0 last:pr-0">
              <div className="whitespace-nowrap text-center text-[8px] font-black uppercase leading-none text-emerald-200">{item.label}</div>
              <div className="mt-1 flex items-center justify-center gap-1 text-[16px] font-black leading-none text-white">
                {item.active && <span className="h-1.5 w-1.5 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.8)]" />}
                {item.value.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

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
      {summary.mode === "firebase" && <p className="mx-auto mt-2 max-w-7xl text-xs text-slate-500">Shared visitor total powered by Firebase. Detailed daily analytics activate with Supabase.</p>}
      {summary.mode === "local-preview" && <p className="mx-auto mt-2 max-w-7xl text-xs text-slate-500">Preview count for this browser. Add valid Firebase or Supabase credentials to enable site-wide visitor analytics.</p>}
    </section>
  );
}
