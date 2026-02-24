"use client";

import { useEffect, useMemo, useState, useTransition, type CSSProperties } from "react";
import { logoutAction, toggleNotificationsAction } from "@/app/actions";

type Props = {
  username: string;
  notificationsEnabled: boolean;
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

export function HomeTabs({ username, notificationsEnabled }: Props) {
  const [tab, setTab] = useState<"meditation" | "self-love" | "settings">("meditation");
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [notifyOn, setNotifyOn] = useState(notificationsEnabled);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!running || elapsed >= 30) return;
    const t = setTimeout(() => setElapsed((v) => v + 1), 1000);
    return () => clearTimeout(t);
  }, [running, elapsed]);

  const phase = useMemo(() => {
    let cumulative = 0;
    for (const item of phases) {
      cumulative += item.seconds;
      if (elapsed < cumulative) {
        return item.label;
      }
    }
    return "Complete";
  }, [elapsed]);

  const remaining = Math.max(0, 30 - elapsed);

  const handleToggle = () => {
    const next = !notifyOn;
    setNotifyOn(next);
    startTransition(async () => {
      await toggleNotificationsAction(next);
    });
  };

  return (
    <main style={{ minHeight: "100vh", padding: 18, maxWidth: 500, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 4 }}>Mindful Moments</h1>
      <p style={{ marginTop: 0, color: "#475569" }}>Welcome, {username}</p>

      <section style={cardStyle}>
        {tab === "meditation" ? (
          <div style={{ display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0 }}>30-Second Guided Breath</h2>
            <p style={{ margin: 0, color: "#475569" }}>Current step: <strong>{phase}</strong></p>
            <p style={{ fontSize: 36, margin: 0, fontWeight: 700 }}>{remaining}s</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={primaryButton} onClick={() => { setElapsed(0); setRunning(true); }}>
                Start
              </button>
              <button style={secondaryButton} onClick={() => setRunning(false)}>
                Pause
              </button>
              <button style={secondaryButton} onClick={() => { setRunning(false); setElapsed(0); }}>
                Reset
              </button>
            </div>
            <small style={{ color: "#64748b" }}>Inhale 5s → Hold 10s → Exhale 5s → Hold 10s</small>
          </div>
        ) : null}

        {tab === "self-love" ? (
          <div style={{ display: "grid", gap: 8 }}>
            <h2 style={{ margin: 0 }}>Self-Love Content</h2>
            {quotes.map((quote) => (
              <blockquote key={quote} style={quoteStyle}>
                “{quote}”
              </blockquote>
            ))}
          </div>
        ) : null}

        {tab === "settings" ? (
          <div style={{ display: "grid", gap: 14 }}>
            <h2 style={{ margin: 0 }}>Settings</h2>
            <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Notifications
              <button onClick={handleToggle} style={notifyOn ? primaryButton : secondaryButton}>
                {notifyOn ? "Enabled" : "Disabled"}
              </button>
            </label>
            <small style={{ color: "#64748b" }}>{pending ? "Saving preference..." : "Notification setting is saved in Redis."}</small>
            <form
              action={async () => {
                await logoutAction();
                window.location.href = "/";
              }}
            >
              <button type="submit" style={{ ...secondaryButton, color: "#b91c1c", borderColor: "#fecaca" }}>
                Log out
              </button>
            </form>
          </div>
        ) : null}
      </section>

      <nav style={navStyle}>
        <TabButton active={tab === "meditation"} onClick={() => setTab("meditation")} label="Meditation" />
        <TabButton active={tab === "self-love"} onClick={() => setTab("self-love")} label="Self Love" />
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")} label="Settings" />
      </nav>
    </main>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} style={{ ...secondaryButton, flex: 1, background: active ? "#dbeafe" : "#fff" }}>
      {label}
    </button>
  );
}

const cardStyle: CSSProperties = {
  background: "white",
  borderRadius: 14,
  padding: 16,
  boxShadow: "0 10px 30px rgba(31,41,55,.08)",
  minHeight: 340
};

const navStyle: CSSProperties = {
  marginTop: 12,
  display: "flex",
  gap: 8,
  background: "#ffffffaa",
  padding: 8,
  borderRadius: 12,
  backdropFilter: "blur(8px)"
};

const primaryButton: CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "white",
  borderRadius: 10,
  padding: "9px 12px",
  fontWeight: 600,
  cursor: "pointer"
};

const secondaryButton: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#1e293b",
  borderRadius: 10,
  padding: "9px 12px",
  fontWeight: 600,
  cursor: "pointer"
};

const quoteStyle: CSSProperties = {
  margin: 0,
  padding: 10,
  background: "#f8fafc",
  borderRadius: 10,
  borderLeft: "4px solid #86efac"
};
