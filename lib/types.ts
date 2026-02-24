export type MoodValue = "great" | "good" | "okay" | "stressed";

export type MoodEntry = {
  value: MoodValue;
  note?: string;
  createdAt: string;
};

export type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
  notificationsEnabled: boolean;
  reminderTimes: [string, string];
  meditationSessions: number;
  meditationHistory: string[];
  moodHistory: MoodEntry[];
  createdAt: string;
};

export type SessionPayload = {
  sub: string;
  username: string;
};
