import { NextResponse } from "next/server";

export function requireCronSecret(request: Request) {
  const configured = process.env.CRON_SECRET;
  if (!configured) {
    return NextResponse.json({ error: "CRON_SECRET is not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  const headerSecret = request.headers.get("x-cron-secret");
  const querySecret = url.searchParams.get("secret");

  if (headerSecret !== configured && querySecret !== configured) {
    return NextResponse.json({ error: "Unauthorized cron request." }, { status: 401 });
  }

  return null;
}
