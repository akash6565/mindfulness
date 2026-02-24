import { getRedis } from "@/lib/redis";
import type { UserRecord } from "@/lib/types";

function userKey(username: string) {
  return `user:${username.toLowerCase()}`;
}

export async function createUser(user: UserRecord) {
  const redis = getRedis();
  const key = userKey(user.username);
  const exists = await redis.exists(key);

  if (exists) {
    throw new Error("User already exists");
  }

  await redis.set(key, user);
}

export async function findUserByUsername(username: string) {
  const redis = getRedis();
  return redis.get<UserRecord>(userKey(username));
}

export async function updateUserNotifications(username: string, enabled: boolean) {
  const redis = getRedis();
  const key = userKey(username);
  const user = await redis.get<UserRecord>(key);

  if (!user) {
    throw new Error("User not found");
  }

  const updated = { ...user, notificationsEnabled: enabled };
  await redis.set(key, updated);

  return updated;
}
