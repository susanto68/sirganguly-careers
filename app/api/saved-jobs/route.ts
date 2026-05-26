import { NextResponse } from "next/server";
import { verifyFirebaseToken } from "@/firebase/admin";
import { createSupabaseAdminClient } from "@/supabase/admin";

export async function GET(request: Request) {
  const user = await verifyFirebaseToken(request.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ savedJobs: [], mode: "local-fallback" });

  const { data, error } = await supabase.from("saved_jobs").select("*").eq("user_id", user.uid).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ savedJobs: data });
}

export async function POST(request: Request) {
  const user = await verifyFirebaseToken(request.headers.get("authorization"));
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = (await request.json()) as { jobId?: string };
  if (!jobId) return NextResponse.json({ error: "jobId is required" }, { status: 400 });

  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ savedJob: { jobId }, mode: "local-fallback" });

  const { data, error } = await supabase
    .from("saved_jobs")
    .upsert({ user_id: user.uid, job_id: jobId }, { onConflict: "user_id,job_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ savedJob: data });
}
