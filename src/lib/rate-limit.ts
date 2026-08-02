import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

type RateLimitResult =
  | { success: true }
  | { success: false; remainingSeconds: number };

/**
 * Rate limiting with Upstash in production, falling back to a simple
 * in-memory limiter for local development (when UPSTASH env vars are absent).
 */
function createLimiter() {
  const hasUpstash =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasUpstash) {
    const redis = Redis.fromEnv();
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
      prefix: "ratelimit:ua",
    });
  }

  // In-memory fallback (single instance, dev only)
  const hits = new Map<string, number[]>();
  const WINDOW_MS = 10_000;
  const MAX = 10;

  return {
    async limit(identifier: string): Promise<RateLimitResult> {
      const now = Date.now();
      const recent = (hits.get(identifier) ?? []).filter((t) => now - t < WINDOW_MS);
      if (recent.length >= MAX) {
        return { success: false, remainingSeconds: Math.ceil((WINDOW_MS - (now - recent[0])) / 1000) };
      }
      recent.push(now);
      hits.set(identifier, recent);
      return { success: true };
    },
  };
}

const limiter = createLimiter();

export async function rateLimit(req: NextRequest | Request, identifierSuffix = "global") {
  const ip =
    (typeof (req as NextRequest).headers?.get === "function"
      ? (req as NextRequest).headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      : null) ?? "unknown";
  const identifier = `${identifierSuffix}:${ip ?? "unknown"}`;
  return limiter.limit(identifier);
}
