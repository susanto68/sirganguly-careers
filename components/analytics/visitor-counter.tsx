"use client";

import { useEffect, useState } from "react";
import { Eye, Radio, Users } from "lucide-react";

type Summary = { totalVisitors: number; visitorsToday: number; onlineVisitors: number; totalPageViews: number; mode: string };

export function VisitorCounter() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("career-session") ?? crypto.randomUUID();
    sessionStorage.setItem("career-session", sessionId);
    fetch("/api/analytics/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: window.location.pathname, sessionId }),
      keepalive: true
    }).finally(() => fetch("/api/analytics/summary").then((response) => response.json()).then(setSummary).catch(() => undefined));
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
      {summary?.mode === "local-preview" && <p className="mx-auto mt-2 max-w-7xl text-xs text-slate-500">Visitor database is ready and will begin counting after Supabase is configured.</p>}
    </section>
  );
}
