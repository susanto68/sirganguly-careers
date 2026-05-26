import { createEmbedding } from "@/search/embeddings";

export async function buildSemanticSearchVector(query: string) {
  return createEmbedding(query);
}
