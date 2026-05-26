import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-black">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">This opportunity may be unavailable or the link may have changed.</p>
      <Link href="/jobs" className="mt-6 inline-flex h-11 items-center rounded-lg bg-emerald-600 px-5 font-black text-white">
        Browse verified jobs
      </Link>
    </section>
  );
}
