import OpenAI from "openai";

// Prefer the Vercel AI Gateway when a gateway key is present: it's OpenAI-API
// compatible and keeps working even if a raw OpenAI key is missing or rate
// limited. Falls back to calling OpenAI directly otherwise.
const gatewayKey = process.env.AI_GATEWAY_API_KEY?.trim();

export const usingGateway = Boolean(gatewayKey);

export const openai = new OpenAI({
  apiKey: gatewayKey || process.env.OPENAI_API_KEY,
  baseURL: gatewayKey ? "https://ai-gateway.vercel.sh/v1" : undefined,
});

// The gateway namespaces models by provider (e.g. "openai/gpt-4o-mini").
// Direct OpenAI uses the bare model id.
export function modelId(model: string): string {
  return usingGateway ? `openai/${model}` : model;
}
