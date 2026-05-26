import OpenAI from "openai";

export async function createEmbedding(input: string) {
  if (!process.env.OPENAI_API_KEY) return null;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input
  });

  return response.data[0]?.embedding ?? null;
}
