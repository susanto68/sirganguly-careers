import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/services/analytics.service";

export const revalidate = 60;

export async function GET() {
  return NextResponse.json(await getAnalyticsSummary());
}
