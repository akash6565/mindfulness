"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByUsername, updateUserNotifications } from "@/lib/db";
import { clearSession, requireSession, saveSession } from "@/lib/auth";

const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(24),
  password: z.string().min(6, "Password must be at least 6 characters")
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
