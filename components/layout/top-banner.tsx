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
  
  // Format to e.g. "Jobs were updated just 1 hour ago."
  const formattedMessage = rawLabel.replace("updated ", "Jobs were updated just ") + ".";

  // Build the live date and time string for the right-hand stamp
  const currentDate = new Date();
  const openedDateStr = currentDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white py-2.5 px-4 text-center text-xs font-black tracking-wide shadow-sm flex flex-col sm:flex-row items-center justify-center gap-2 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
        .text-blink {
          animation: custom-blink 1.4s infinite;
        }
        .times-roman-font {
          font-family: "Times New Roman", Times, Baskerville, Georgia, serif !important;
        }
      `}} />

      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-emerald-200 animate-pulse shrink-0" />
        <span className="text-blink">{formattedMessage}</span>
        <span className="hidden sm:inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white">
          Official Sources Only
        </span>
      </div>

      {/* Right top date-time text in Times New Roman */}
      <div 
        className="times-roman-font text-[10px] font-normal text-emerald-200/90 sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 mt-1 sm:mt-0 tracking-normal"
        title="Opening Timestamp"
      >
        Opened on:- {openedDateStr}
      </div>
    </div>
  );
}
