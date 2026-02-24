"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  addMeditationSession,
  addMoodEntry,
  createUser,
  findUserByUsername,
  updateReminderTimes,
  updateUserNotifications
} from "@/lib/db";
import { clearSession, requireSession, saveSession } from "@/lib/auth";
import type { MoodValue } from "@/lib/types";

const authSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(24),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const reminderSchema = z.object({
  firstTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  secondTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format")
});

const moodSchema = z.object({
  value: z.enum(["great", "good", "okay", "stressed"]),
  note: z.string().max(140).optional()
});

export type ActionState = {
  error?: string;
  success?: string;
};

export async function signupAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  });

  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  if (parsed.data.password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const existing = await findUserByUsername(parsed.data.username);
  if (existing) {
    return { error: "Username already taken" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = {
    id: crypto.randomUUID(),
    username: parsed.data.username,
    passwordHash,
    notificationsEnabled: true,
    reminderTimes: ["10:00", "16:00"] as [string, string],
    meditationSessions: 0,
    meditationHistory: [],
    moodHistory: [],
    createdAt: new Date().toISOString()
  };

  await createUser(user);
  await saveSession({ sub: user.id, username: user.username });
  return { success: "Account created" };
}

export async function loginAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = authSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await findUserByUsername(parsed.data.username);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  const match = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!match) {
    return { error: "Invalid credentials" };
  }

  await saveSession({ sub: user.id, username: user.username });
  return { success: "Logged in" };
}

export async function logoutAction() {
  clearSession();
}

export async function toggleNotificationsAction(enabled: boolean) {
  const session = await requireSession();
  await updateUserNotifications(session.username, enabled);
}

export async function saveReminderTimesAction(firstTime: string, secondTime: string): Promise<ActionState> {
  const parsed = reminderSchema.safeParse({ firstTime, secondTime });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid reminder times" };
  }

  const session = await requireSession();
  await updateReminderTimes(session.username, parsed.data.firstTime, parsed.data.secondTime);
  return { success: "Reminder times updated" };
}

export async function completeMeditationAction() {
  const session = await requireSession();
  await addMeditationSession(session.username);
}

export async function saveMoodAction(value: MoodValue, note?: string): Promise<ActionState> {
  const parsed = moodSchema.safeParse({ value, note });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid mood entry" };
  }

  const session = await requireSession();
  await addMoodEntry(session.username, {
    value: parsed.data.value,
    note: parsed.data.note,
    createdAt: new Date().toISOString()
  });

  return { success: "Mood saved" };
}
