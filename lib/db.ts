import { getRedis } from "@/lib/redis";
import type { MoodEntry, UserRecord } from "@/lib/types";

function userKey(username: string) {
  return `user:${username.toLowerCase()}`;
}

async function saveUser(user: UserRecord) {
  const redis = getRedis();
  await redis.set(userKey(user.username), user);
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
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const updated: UserRecord = { ...user, notificationsEnabled: enabled };
  await saveUser(updated);
  return updated;
}

export async function updateReminderTimes(username: string, firstTime: string, secondTime: string) {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const updated: UserRecord = {
    ...user,
    reminderTimes: [firstTime, secondTime]
  };
  await saveUser(updated);
  return updated;
}

export async function addMeditationSession(username: string) {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const now = new Date().toISOString();
  const updated: UserRecord = {
    ...user,
    meditationSessions: user.meditationSessions + 1,
    meditationHistory: [now, ...user.meditationHistory].slice(0, 30)
  };

  await saveUser(updated);
  return updated;
}

export async function addMoodEntry(username: string, entry: MoodEntry) {
  const user = await findUserByUsername(username);
  if (!user) throw new Error("User not found");

  const updated: UserRecord = {
    ...user,
    moodHistory: [entry, ...user.moodHistory].slice(0, 30)
  };

  await saveUser(updated);
  return updated;
}
