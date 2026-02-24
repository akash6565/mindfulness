# Mindful Moments (Milestone 1)

A complete Milestone 1 implementation using **Next.js (App Router)** and **Redis (Upstash)**.

## Features shipped

- Sign up and login flow with password hashing.
- Redis-backed user storage and notification preferences.
- Session auth via signed JWT cookie.
- Protected `/home` route.
- Milestone 1 tabs:
  - Meditation: 30-second breathing routine (5 in, 10 hold, 5 out, 10 hold)
  - Self Love: quotes/mantras/affirmations feed
  - Settings: notification toggle + logout

## Tech stack

- Next.js 14 + TypeScript
- Redis via `@upstash/redis`
- Zod for validation
- bcryptjs for password hashing
- jose for session token signing

## Environment

Create `.env.local`:

```bash
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
SESSION_SECRET="use-a-long-random-secret"
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Architecture

- `app/actions.ts`: server actions for auth and settings updates
- `lib/db.ts`: Redis persistence layer
- `lib/auth.ts`: cookie + JWT session helpers
- `components/AuthForm.tsx`: reusable login/signup form
- `components/HomeTabs.tsx`: Milestone 1 tab UI and behavior
