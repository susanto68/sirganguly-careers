import { NextResponse } from "next/server";
import { categorySlugs } from "@/lib/jobs-data";

export async function GET() {
  return NextResponse.json({ categories: categorySlugs });
}
