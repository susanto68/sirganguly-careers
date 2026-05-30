import { createClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !url.startsWith("http") || url.includes("placeholder") || url.includes("your_supabase") || !anonKey) {
    return null;
  }

  try {
    return createClient(url, anonKey);
  } catch (error) {
    console.error("Failed to initialize Supabase browser client:", error);
    return null;
  }
}
