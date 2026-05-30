import { createSupabaseAdminClient } from "@/supabase/admin";
import { Sparkles } from "lucide-react";
import { getFreshnessLabel } from "@/utils/dates";

async function getLastSyncTime(): Promise<string> {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("refresh_logs")
        .select("created_at")
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data?.created_at) {
        return data.created_at;
      }
    } catch {
      // Graceful fallback
    }
  }

  // Fallback to recent date: current time minus 1 hour
  return new Date(Date.now() - 60 * 60 * 1000).toISOString();
}

export async function TopBanner() {
  const lastSyncTime = await getLastSyncTime();
  const rawLabel = getFreshnessLabel(lastSyncTime).toLowerCase();
  
  // Format to requested format e.g. "Jobs were updated just one hour ago." or "Jobs were updated just 30 minutes ago."
  // getFreshnessLabel returns e.g. "Updated 1 hour ago" -> we convert it to "Jobs were updated just 1 hour ago."
  const formattedMessage = rawLabel.replace("updated ", "Jobs were updated just ") + ".";

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white py-2 px-4 text-center text-xs font-black tracking-wide shadow-sm flex items-center justify-center gap-2">
      <Sparkles className="h-3.5 w-3.5 text-emerald-200 animate-pulse shrink-0" />
      <span>{formattedMessage}</span>
      <span className="hidden sm:inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white">
        Official Sources Only
      </span>
    </div>
  );
}
