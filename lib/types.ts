export type UserRecord = {
  id: string;
  username: string;
  passwordHash: string;
  notificationsEnabled: boolean;
  createdAt: string;
};

export type SessionPayload = {
  sub: string;
  username: string;
};
