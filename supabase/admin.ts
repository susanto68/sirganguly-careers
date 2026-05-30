import "server-only";
import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !url.startsWith("http") || url.includes("placeholder") || url.includes("your_supabase") || !serviceRoleKey) {
    return null;
  }

  try {
    return createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  } catch (error) {
    console.error("Failed to initialize Supabase admin client:", error);
    return null;
  }
}
