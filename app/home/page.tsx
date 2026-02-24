import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { findUserByUsername } from "@/lib/db";
import { HomeTabs } from "@/components/HomeTabs";

export default async function HomePage() {
  const session = await requireSession();
  const user = await findUserByUsername(session.username);

  if (!user) {
    redirect("/");
  }

  return (
    <HomeTabs
      username={user.username}
      notificationsEnabled={user.notificationsEnabled}
      reminderTimes={user.reminderTimes}
      meditationSessions={user.meditationSessions}
      moodHistory={user.moodHistory}
    />
  );
}
