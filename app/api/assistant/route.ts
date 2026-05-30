import { NextResponse } from "next/server";
import { chatWithGroq } from "@/services/groq.service";

// Simple in-memory rate limiting map for serverless environment
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // Up to 10 assistant requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + LIMIT_WINDOW });
    return true;
  }

  if (now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count += 1;
  return true;
}

export async function POST(request: Request) {
  // 1. Rate limiting check
  const ip = request.headers.get("x-forwarded-for") || "local-client";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  try {
    const { messages } = (await request.json()) as {
      messages?: { role: "user" | "assistant"; content: string }[];
    };

    // 2. Input validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Invalid conversational history payload." }, { status: 400 });
    }

    // Sanitize message content to prevent potential XSS injection issues
    const sanitizedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content.replace(/<[^>]*>/g, "").slice(0, 1000) // Strip tags and limit size
    }));

    // Inject system prompt to guide Llama to answer concisely as a Career Guidance bot
    const formattedHistory: { role: "user" | "assistant" | "system"; content: string }[] = [
      {
        role: "system",
        content:
          "You are CareerTrust AI Assistant. You are a helpful, professional, and concise career advisor. Guide students on career roadmaps, skills, resume updates, and interview prep. DO NOT recommend third-party consulting or paid schemes. Keep answers brief (under 3 paragraphs) using clear Markdown. Only recommend official company pages and official government sites."
      },
      ...sanitizedMessages
    ];

    const reply = await chatWithGroq(formattedHistory);

    if (!reply) {
      // Fallback response if API key is not configured or fails
      return NextResponse.json({
        reply: "Hello! I am operating in offline fallback mode because the live AI reasoning server is currently unavailable. To get career guidance, please verify that the official keys are added, or consult our verified resource cards on the Dashboard."
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Assistant API failed:", error);
    return NextResponse.json({ error: "Failed to process chat conversation." }, { status: 500 });
  }
}
