"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Calendar, Newspaper, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: string;
  title: string;
  category: "Hiring Trends" | "Technology Updates" | "Government Notifications";
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) {
        throw new Error("Failed to load industry news updates.");
      }
      const data = (await response.json()) as { news?: NewsItem[] };
      if (data.news) {
        setNews(data.news);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const categories = ["All", "Hiring Trends", "Technology Updates", "Government Notifications"];

  const filteredNews = activeCategory === "All"
    ? news
    : news.filter((item) => item.category === activeCategory);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.22),_transparent_32%),linear-gradient(135deg,_#fff1f2,_#faf5ff_42%,_#fafaf9)] p-6 shadow-soft dark:bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.18),_transparent_30%),linear-gradient(135deg,_#090514,_#0f172a_48%,_#1e1b4b)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600 flex items-center gap-2">
          <Radio className="h-4 w-4 text-rose-600 animate-pulse shrink-0" /> Live Feed
        </p>
        <h1 className="mt-2 text-4xl font-black leading-tight text-ink dark:text-white">Industry and Government News</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
          Get real-time updates regarding student hiring announcements, verified technology shifts, and official civil services notifications.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold shadow-card transition ${
              activeCategory === cat
                ? "bg-emerald-600 text-white"
                : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content display */}
      {isLoading ? (
        <div className="grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-xl p-5 animate-pulse h-48 space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass rounded-xl p-8 text-center border border-rose-200 dark:border-rose-900/40">
          <h2 className="text-xl font-black text-rose-600">Failed to sync news</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{error}</p>
          <button
            onClick={fetchNews}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <h2 className="text-xl font-black">No news items found</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Check back later for recent announcements in the {activeCategory} category.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="group rounded-xl border border-white/70 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(240,253,250,0.78)_48%,_rgba(239,246,255,0.82))] p-5 shadow-soft backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-glow dark:border-white/10 dark:bg-[linear-gradient(135deg,_rgba(15,23,42,0.9),_rgba(12,74,110,0.44)_48%,_rgba(49,46,129,0.34))] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <Badge
                    tone={
                      item.category === "Government Notifications"
                        ? "amber"
                        : item.category === "Technology Updates"
                        ? "sky"
                        : "violet"
                    }
                  >
                    {item.category}
                  </Badge>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {item.publishedAt}
                  </span>
                </div>
                <h3 className="text-lg font-black leading-tight text-ink transition group-hover:text-emerald-700 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300 mb-4">{item.summary}</p>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <Newspaper className="h-3.5 w-3.5" />
                  {item.source}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-ink"
                >
                  View Announcement
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
