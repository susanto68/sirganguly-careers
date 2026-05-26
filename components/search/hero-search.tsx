"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="glass grid gap-3 rounded-xl p-3 sm:grid-cols-[1.2fr_0.8fr_auto]">
      <label className="flex h-12 items-center gap-3 rounded-lg bg-white px-4 dark:bg-slate-900">
        <Search className="h-5 w-5 text-emerald-600" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search freshers, internships, government, IT..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
      </label>
      <label className="flex h-12 items-center gap-3 rounded-lg bg-white px-4 dark:bg-slate-900">
        <MapPin className="h-5 w-5 text-coral" />
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
      </label>
      <Button type="submit" size="lg" className="bg-emerald-600 hover:bg-emerald-700">
        <Sparkles className="h-4 w-4" />
        AI Search
      </Button>
    </form>
  );
}
