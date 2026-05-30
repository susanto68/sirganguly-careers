import { NextResponse } from "next/server";
import { getAggregatedNews } from "@/services/news.service";

export async function GET() {
  try {
    const news = await getAggregatedNews();
    
    // Add cache control headers for standard CDN edge caching
    const response = NextResponse.json({ news });
    response.headers.set("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("News API failed:", error);
    return NextResponse.json({ error: "Failed to gather latest industry updates." }, { status: 500 });
  }
}
