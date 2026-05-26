import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const nav = [
  { href: "/jobs", label: "Jobs" },
  { href: "/category/government-jobs", label: "Government" },
  { href: "/category/internship", label: "Internships" },
  { href: "/dashboard", label: "Dashboard" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/50 bg-white/72 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-base font-black leading-tight">CareerTrust AI</span>
            <span className="hidden text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">Verified student opportunities</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-ink dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/saved"
            className="hidden h-10 items-center gap-2 rounded-lg bg-white px-3 text-sm font-bold text-ink shadow-card transition hover:bg-slate-50 dark:bg-slate-800 dark:text-white sm:inline-flex"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            Saved
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-card transition hover:bg-emerald-700"
            title="Dashboard"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
