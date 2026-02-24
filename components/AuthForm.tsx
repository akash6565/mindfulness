"use client";

import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/app/actions";

const initialState: ActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {pending ? "Working..." : label}
    </button>
  );
}

export function AuthForm({
  title,
  action,
  submitLabel,
  altHref,
  altLabel,
  includeConfirm = false
}: {
  title: string;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel: string;
  altHref: string;
  altLabel: string;
  includeConfirm?: boolean;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/home");
    }
  }, [state.success, router]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <form
        action={formAction}
        style={{
          width: "100%",
          maxWidth: 360,
          background: "white",
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(31,41,55,.12)",
          padding: 20,
          display: "grid",
          gap: 12
        }}
      >
        <h1 style={{ margin: 0 }}>{title}</h1>
        <label>
          Username
          <input name="username" required minLength={3} style={inputStyle} />
        </label>
        <label>
          Password
          <input name="password" type="password" required minLength={6} style={inputStyle} />
        </label>
        {includeConfirm && (
          <label>
            Confirm password
            <input name="confirmPassword" type="password" required minLength={6} style={inputStyle} />
          </label>
        )}
        {state.error ? <p style={{ color: "#b91c1c", margin: 0 }}>{state.error}</p> : null}
        <SubmitButton label={submitLabel} />
        <Link href={altHref} style={{ color: "#2563eb", fontWeight: 600 }}>
          {altLabel}
        </Link>
      </form>
    </main>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  marginTop: 6,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  padding: "10px 12px",
  outline: "none"
};
