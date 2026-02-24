import type { CSSProperties } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const session = await getSession();
  if (session) redirect("/home");

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(31,41,55,.12)",
          padding: 24,
          textAlign: "center"
        }}
      >
        <h1 style={{ margin: 0 }}>Mindful Moments</h1>
        <p style={{ color: "#475569", lineHeight: 1.5 }}>
          Reduce stress and reset your focus with a 30-second guided breathing routine and uplifting affirmations.
        </p>
        <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
          <Link href="/login" style={buttonPrimary}>Log In</Link>
          <Link href="/signup" style={buttonSecondary}>Sign Up</Link>
        </div>
      </section>
    </main>
  );
}

const buttonPrimary: CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "white",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 600
};

const buttonSecondary: CSSProperties = {
  border: "1px solid #cbd5e1",
  background: "white",
  color: "#1e293b",
  borderRadius: 10,
  padding: "10px 12px",
  fontWeight: 600
};
