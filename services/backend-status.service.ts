import { getCompanies } from "@/services/company.service";
import { getJobs } from "@/services/job.service";

type ProviderStatus = {
  name: string;
  configured: boolean;
  label: string;
  detail: string;
};

function provider(name: string, configured: boolean, readyDetail: string, fallbackDetail: string): ProviderStatus {
  return {
    name,
    configured,
    label: configured ? "Connected" : "Needs env",
    detail: configured ? readyDetail : fallbackDetail
  };
}

export async function getBackendStatus() {
  const [jobs, companies] = await Promise.all([getJobs(), getCompanies()]);
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const firebaseAdminConfigured = Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
  const firebaseClientConfigured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  );
  const openAiConfigured = Boolean(process.env.OPENAI_API_KEY);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const groqConfigured = Boolean(process.env.GROQ_API_KEY);
  const cronConfigured = Boolean(process.env.CRON_SECRET);

  const providerStatuses = [
    provider("Supabase", supabaseConfigured, "Database reads, writes, refresh logs, and saved jobs can persist.", "Using trusted seed jobs until Supabase keys are added."),
    provider("Firebase client", firebaseClientConfigured, "Google and email sign-in can run in the browser.", "Auth UI stays ready, but sign-in needs Firebase web keys."),
    provider("Firebase admin", firebaseAdminConfigured, "Protected APIs can verify Firebase ID tokens.", "Saved jobs API will reject cloud saves until admin keys are added."),
    provider("Groq", groqConfigured, "Groq is available as the fast AI reasoning provider.", "AI summaries use the safe local pipeline until the key is added."),
    provider("OpenAI", openAiConfigured, "OpenAI can power embeddings and semantic search.", "Search is keyword plus trust ranking until the key is added."),
    provider("Gemini", geminiConfigured, "Gemini is available for extraction and student summaries.", "Extraction uses trusted source data until the key is added."),
    provider("Vercel Cron", cronConfigured, "Daily refresh route can be protected with CRON_SECRET.", "Cron route exists, but secret must be added in Vercel.")
  ];

  const configuredAiProviders = [groqConfigured, openAiConfigured, geminiConfigured].filter(Boolean).length;

  return {
    mode: supabaseConfigured ? "database" : "seed-fallback",
    checkedAt: new Date().toISOString(),
    counts: {
      activeJobs: jobs.length,
      trustedCompanies: companies.length,
      endingSoon: jobs.filter((job) => job.deadline).filter((job) => {
        const timeLeft = new Date(job.deadline as string).getTime() - Date.now();
        return timeLeft >= 0 && timeLeft <= 7 * 24 * 60 * 60 * 1000;
      }).length,
      fresherJobs: jobs.filter((job) => job.fresher).length,
      internships: jobs.filter((job) => job.categories.includes("Internship")).length,
      governmentJobs: jobs.filter((job) => job.categories.includes("Government")).length
    },
    search: {
      fastKeywordSearch: true,
      officialDomainRanking: true,
      semanticSearchReady: openAiConfigured,
      persistentSearchLogsReady: supabaseConfigured
    },
    refresh: {
      route: "/api/cron/daily-refresh",
      mode: supabaseConfigured ? "database-upsert" : "dry-run",
      cronSecretConfigured: cronConfigured
    },
    ai: {
      configuredProviders: configuredAiProviders,
      primaryBrain: groqConfigured ? "Groq" : openAiConfigured ? "OpenAI" : geminiConfigured ? "Gemini" : "Local trust pipeline"
    },
    providers: providerStatuses
  };
}
