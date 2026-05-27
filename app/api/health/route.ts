import { NextResponse } from "next/server";
import { getBackendStatus } from "@/services/backend-status.service";

export async function GET() {
  const status = await getBackendStatus();
  return NextResponse.json(status);
}
