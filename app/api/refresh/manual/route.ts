import { NextResponse } from "next/server";
import { runDailyRefresh } from "@/services/refresh.service";
import { requireCronSecret } from "@/utils/security";

export async function POST(request: Request) {
  const unauthorized = requireCronSecret(request);
  if (unauthorized) return unauthorized;

  const result = await runDailyRefresh();
  return NextResponse.json(result);
}
