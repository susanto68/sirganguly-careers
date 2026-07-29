import { NextResponse } from "next/server";
import { z } from "zod";
import { recordVisit } from "@/services/analytics.service";

const payloadSchema = z.object({ path: z.string().max(300), sessionId: z.string().max(100) });

export async function POST(request: Request) {
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid visit payload." }, { status: 400 });
  return NextResponse.json(await recordVisit(request, parsed.data.path, parsed.data.sessionId));
}
