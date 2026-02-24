# Mindful Moments (Milestone 1+)

A modern, minimalistic wellness app built with **Next.js App Router** and **Redis (Upstash)**.

## What is implemented

### Core Milestone 1
- Account creation and login with secure password hashing.
- Signed session cookie auth and protected home area.
- 30-second guided breathing session:
  - Inhale 5s → Hold 10s → Exhale 5s → Hold 10s.
- Self-love content feed with quotes, mantras, and affirmations.
- Settings with notifications toggle and logout.

### Also completed from the product description
- Mindfulness reminder scheduling (two configurable reminder times).
- Mental well-being tracking via mood check-ins + optional notes.
- Meditation progress tracking (session count + recent activity persistence).

## Tech stack
- Next.js 14 + TypeScript
- Upstash Redis (`@upstash/redis`)
- Zod (validation)
- bcryptjs (password hashing)
- jose (JWT signing)

## Environment variables
Create `.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
SESSION_SECRET="use-a-long-random-secret"
```

## Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Architecture
- `app/actions.ts` — server actions for auth, reminders, mood, and meditation completion.
- `lib/auth.ts` — JWT cookie session helpers.
- `lib/db.ts` — Redis persistence for users, reminders, sessions, and mood entries.
- `components/HomeTabs.tsx` — primary authenticated UX (Meditation, Self Love, Settings).
- `components/AuthForm.tsx` — reusable auth UI for login/signup.
