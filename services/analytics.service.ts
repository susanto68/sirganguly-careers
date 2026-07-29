import "server-only";
import { createHash } from "crypto";
import { createSupabaseAdminClient } from "@/supabase/admin";

function hash(value: string) {
  return createHash("sha256").update(`${process.env.RATE_LIMIT_SECRET ?? "local"}:${value}`).digest("hex");
}

function browserName(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent)) return "Safari";
  return "Other";
}

function deviceType(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

export async function recordVisit(request: Request, path: string, sessionId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { stored: false, mode: "local-preview" as const };
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const userAgent = request.headers.get("user-agent") ?? "unknown";
  const visitorHash = hash(`${forwarded}:${userAgent}`);
  const { error } = await supabase.from("visitor_stats").insert({
    visitor_hash: visitorHash,
    session_hash: hash(sessionId || visitorHash),
    path: path.slice(0, 300),
    country_code: request.headers.get("x-vercel-ip-country") ?? "Unknown",
    device_type: deviceType(userAgent),
    browser_name: browserName(userAgent)
  });
  if (error) throw error;
  return { stored: true, mode: "database" as const };
}

export async function getAnalyticsSummary() {
  const supabase = createSupabaseAdminClient();
  const empty = { totalVisitors: 0, visitorsToday: 0, onlineVisitors: 0, totalPageViews: 0, visitorsInIndia: 0 };
  if (!supabase) return { ...empty, mode: "local-preview" as const };
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const onlineSince = new Date(now.getTime() - 5 * 60_000).toISOString();
  const { data, error } = await supabase.from("visitor_stats").select("visitor_hash, viewed_at, country_code");
  if (error) throw error;
  const rows = data ?? [];
  const indiaRows = rows.filter((row) => row.country_code === "IN");
  return {
    totalVisitors: new Set(rows.map((row) => row.visitor_hash)).size,
    visitorsToday: new Set(rows.filter((row) => row.viewed_at >= today).map((row) => row.visitor_hash)).size,
    onlineVisitors: new Set(rows.filter((row) => row.viewed_at >= onlineSince).map((row) => row.visitor_hash)).size,
    visitorsInIndia: new Set(indiaRows.map((row) => row.visitor_hash)).size,
    totalPageViews: rows.length,
    mode: "database" as const
  };
}
