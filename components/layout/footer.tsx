import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/60 bg-white/60 py-10 dark:border-white/10 dark:bg-slate-950/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 font-black">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            CareerTrust AI
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            We help students discover verified jobs and internships, then send them directly to official company or government application pages.
          </p>
        </div>
        <div className="grid gap-2 text-sm">
          <span className="font-bold">Explore</span>
          <Link href="/jobs">All jobs</Link>
          <Link href="/category/government-jobs">Government jobs</Link>
          <Link href="/category/abroad-jobs">Abroad jobs</Link>
          <Link href="/news">Industry news</Link>
        </div>
        <div className="grid gap-2 text-sm">
          <span className="font-bold">Trust</span>
          <Link href="/dashboard">Student dashboard</Link>
          <Link href="/saved">Saved jobs</Link>
          <span className="text-slate-500">Official apply links only</span>
        </div>
      </div>
    </footer>
  );
}
