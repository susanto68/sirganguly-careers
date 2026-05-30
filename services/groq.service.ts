import Groq from "groq-sdk";

// Fast in-memory cache for API route responses to reduce token costs and eliminate latency
const responseCache = new Map<string, { response: string; expiry: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache duration

function getCacheKey(systemPrompt: string, userPrompt: string): string {
  const data = `${systemPrompt}||${userPrompt}`;
  // Simple fast string hashing function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

export async function askGroq(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 250
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  // Check memory cache
  const cacheKey = getCacheKey(systemPrompt, userPrompt);
  const cached = responseCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return cached.response;
  }

  try {
    const groq = new Groq({ apiKey });
    
    // Extremely optimized prompts for Llama-3.1-8b-instant for fast, low-token responses
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.1, // High determinism
      max_tokens: maxTokens
    });

    const reply = response.choices[0]?.message?.content?.trim() || null;
    
    if (reply) {
      // Store in memory cache
      responseCache.set(cacheKey, {
        response: reply,
        expiry: Date.now() + CACHE_TTL
      });
    }

    return reply;
  } catch (error) {
    console.error("Groq Cloud execution failed:", error);
    return null;
  }
}

export async function chatWithGroq(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  maxTokens: number = 350
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const groq = new Groq({ apiKey });
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.5,
      max_tokens: maxTokens
    });
    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("Groq Cloud Chat completion failed:", error);
    return null;
  }
}
