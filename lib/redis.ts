import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

export function getRedis() {
  if (!redisInstance) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in environment.");
    }

    redisInstance = new Redis({ url, token });
  }

  return redisInstance;
}
