"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  completeMeditationAction,
  logoutAction,
  saveMoodAction,
  saveReminderTimesAction,
  toggleNotificationsAction
} from "@/app/actions";
import type { MoodEntry, MoodValue } from "@/lib/types";

type Props = {
  username: string;
  notificationsEnabled: boolean;
  reminderTimes: [string, string];
  meditationSessions: number;
  moodHistory: MoodEntry[];
};

const quotes = [
  "You are capable of hard things.",
  "Pause. Breathe. Continue.",
  "Progress over perfection.",
  "Small calm moments build a strong mind.",
  "Your peace is productive too."
];

const phases = [
  { label: "Breathe In", seconds: 5 },
  { label: "Hold", seconds: 10 },
  { label: "Breathe Out", seconds: 5 },
  { label: "Hold", seconds: 10 }
];

const moodOptions: { label: string; value: MoodValue; emoji: string }[] = [
  { label: "Great", value: "great", emoji: "😌" },
  { label: "Good", value: "good", emoji: "🙂" },
  { label: "Okay", value: "okay", emoji: "😐" },
  { label: "Stressed", value: "stressed", emoji: "😮‍💨" }
];

export function HomeTabs(props: Props) {
  const [tab, setTab] = useState<"meditation" | "self-love" | "settings">("meditation");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [notifyOn, setNotifyOn] = useState(props.notificationsEnabled);
  const [reminder1, setReminder1] = useState(props.reminderTimes[0]);
  const [reminder2, setReminder2] = useState(props.reminderTimes[1]);
  const [mood, setMood] = useState<MoodValue>("good");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string>("");
  const [sessions, setSessions] = useState(props.meditationSessions);
  const [moods, setMoods] = useState(props.moodHistory);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!running || elapsed >= 30) return;
    const timer = setTimeout(() => setElapsed((v) => v + 1), 1000);
    return () => clearTimeout(timer);
  }, [running, elapsed]);

  useEffect(() => {
    if (elapsed === 30 && running) {
      setRunning(false);
      setSessions((s) => s + 1);
      startTransition(async () => {
        await completeMeditationAction();
        setStatus("Great job! Session recorded.");
      });
    }
  }, [elapsed, running]);

  const phase = useMemo(() => {
    let cumulative = 0;
    for (const item of phases) {
      cumulative += item.seconds;
      if (elapsed < cumulative) return item.label;
    }
    return "Complete";
  }, [elapsed]);

  const remaining = Math.max(0, 30 - elapsed);
  const progress = (elapsed / 30) * 100;

  const toggleNotifications = () => {
    const next = !notifyOn;
    setNotifyOn(next);
    startTransition(async () => {
      await toggleNotificationsAction(next);
      setStatus(`Notifications ${next ? "enabled" : "disabled"}.`);
    });
  };

  const saveReminderTimes = () => {
    startTransition(async () => {
      const result = await saveReminderTimesAction(reminder1, reminder2);
      setStatus(result.error ?? result.success ?? "");
    });
  };

  const saveMood = () => {
    startTransition(async () => {
      const result = await saveMoodAction(mood, note);
      if (result.success) {
        setMoods((prev) => [{ value: mood, note, createdAt: new Date().toISOString() }, ...prev].slice(0, 30));
        setNote("");
      }
      setStatus(result.error ?? result.success ?? "");
    });
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Mindful Moments</p>
          <h1>Welcome back, {props.username}</h1>
        </div>
        <div className="pill">{sessions} sessions</div>
      </header>

      <section className="panel">
        {tab === "meditation" && (
          <div className="stack">
            <h2>30-second guided breathing</h2>
            <p className="muted">{phase}</p>
            <div className="ring-wrap">
              <div className="ring" style={{ background: `conic-gradient(#4f46e5 ${progress * 3.6}deg, #e2e8f0 0deg)` }}>
                <div className="ring-inner">{remaining}s</div>
              </div>
            </div>
            <div className="row">
              <button className="btn btn-primary" onClick={() => { setElapsed(0); setRunning(true); setStatus(""); }}>Start</button>
              <button className="btn" onClick={() => setRunning(false)}>Pause</button>
              <button className="btn" onClick={() => { setRunning(false); setElapsed(0); }}>Reset</button>
            </div>
            <small className="muted">Inhale 5s → Hold 10s → Exhale 5s → Hold 10s</small>
          </div>
        )}

        {tab === "self-love" && (
          <div className="stack">
            <h2>Self-love & mood tracker</h2>
            <div className="quote-grid">
              {quotes.map((quote) => (
                <blockquote key={quote} className="quote-card">“{quote}”</blockquote>
              ))}
            </div>

            <div className="mood-card">
              <p className="muted">How do you feel right now?</p>
              <div className="row wrap">
                {moodOptions.map((m) => (
                  <button
                    key={m.value}
                    className={`btn ${mood === m.value ? "btn-primary" : ""}`}
                    onClick={() => setMood(m.value)}
                  >
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
              <textarea
                className="textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional note (what's on your mind?)"
                maxLength={140}
              />
              <button className="btn btn-primary" onClick={saveMood} disabled={pending}>Save check-in</button>
            </div>

            <div className="stack-sm">
              <p className="muted">Recent check-ins</p>
              {moods.slice(0, 5).map((entry, idx) => (
                <div key={`${entry.createdAt}-${idx}`} className="list-item">
                  <strong>{entry.value}</strong>
                  <span className="muted">{new Date(entry.createdAt).toLocaleString()}</span>
                </div>
              ))}
              {moods.length === 0 && <p className="muted">No mood check-ins yet.</p>}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="stack">
            <h2>Settings & reminders</h2>
            <div className="list-item">
              <span>Mindfulness notifications</span>
              <button className={`btn ${notifyOn ? "btn-primary" : ""}`} onClick={toggleNotifications}>
                {notifyOn ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="row wrap">
              <label className="stack-sm">
                Morning reminder
                <input className="input" type="time" value={reminder1} onChange={(e) => setReminder1(e.target.value)} />
              </label>
              <label className="stack-sm">
                Afternoon reminder
                <input className="input" type="time" value={reminder2} onChange={(e) => setReminder2(e.target.value)} />
              </label>
            </div>
            <button className="btn btn-primary" onClick={saveReminderTimes} disabled={pending}>Save reminder times</button>

            <form
              action={async () => {
                await logoutAction();
                window.location.href = "/";
              }}
            >
              <button type="submit" className="btn btn-danger">Log out</button>
            </form>
          </div>
        )}
      </section>

      <nav className="tabbar">
        <TabButton active={tab === "meditation"} onClick={() => setTab("meditation")} label="Meditation" />
        <TabButton active={tab === "self-love"} onClick={() => setTab("self-love")} label="Self Love" />
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")} label="Settings" />
      </nav>

      <p className="status">{pending ? "Saving…" : status}</p>
    </main>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button className={`tab ${active ? "tab-active" : ""}`} onClick={onClick}>
      {label}
    </button>
  );
}
