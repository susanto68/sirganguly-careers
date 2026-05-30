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
    <div className="relative bg-gradient-to-r from-emerald-800 via-teal-900 to-cyan-950 text-white py-3 px-4 text-center text-xs font-bold tracking-wide shadow-glow flex flex-col sm:flex-row items-center justify-center gap-3 overflow-hidden border-b border-white/10">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes custom-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .text-blink {
          animation: custom-blink 1.2s infinite;
        }
        .times-roman-font {
          font-family: "Times New Roman", Times, Baskerville, Georgia, serif !important;
        }
        .prominent-badge-left {
          background: rgba(254, 240, 138, 0.15) !important;
          border: 1px solid rgba(254, 240, 138, 0.45) !important;
          color: #fef08a !important;
          text-shadow: 0 0 8px rgba(254, 240, 138, 0.3);
        }
        .prominent-badge-right {
          background: rgba(255, 255, 255, 0.12) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: #ffffff !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }
      `}} />

      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse shrink-0" />
        <span className="text-blink prominent-badge-left inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-black text-xs">
          {formattedMessage}
        </span>
        <span className="hidden sm:inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white">
          Official
        </span>
      </div>

      {/* Right top date-time text in Times New Roman prominent badge */}
      <div 
        className="times-roman-font text-xs font-bold tracking-normal sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 mt-1 sm:mt-0"
        title="Opening Timestamp"
      >
        <span className="prominent-badge-right inline-flex items-center gap-1 rounded-full px-3 py-1">
          Opened on:- {openedDateStr}
        </span>
      </div>
    </div>
  );
}
