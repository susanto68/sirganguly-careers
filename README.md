# CareerTrust AI

AI-powered Student Career & Job Opportunity Platform for verified jobs, internships, government opportunities, and official apply links.

This website is not a recruitment consultancy. It only helps students discover opportunities and redirects them to official company or government application pages.

## Features

- Next.js 15 App Router with TypeScript strict mode
- Tailwind CSS premium responsive UI
- Dark/light mode
- PWA manifest
- Verified job cards with official apply links
- Category pages, company pages, job details, dashboard, saved jobs
- Firebase Authentication integration points
- Supabase PostgreSQL schema, RLS, and indexes
- Modular AI-agent refresh pipeline
- Vercel Cron daily refresh route
- Hybrid search-ready service architecture

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and fill:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_PROJECT_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
GEMINI_API_KEY=
GROQ_API_KEY=
CRON_SECRET=
```

The app works with trusted seed data before Supabase is connected.

## Supabase Setup

Run these files in Supabase SQL Editor:

1. `database/schema.sql`
2. `database/indexes.sql`
3. `database/rls.sql`
4. `database/seed.sql`

Use `SUPABASE_SERVICE_ROLE_KEY` only on the server and in Vercel environment variables.

## Firebase Setup

1. Create a Firebase project.
2. Enable Google Sign-in and Email/Password in Authentication.
3. Add web app credentials to `NEXT_PUBLIC_FIREBASE_*`.
4. Add service account credentials to `FIREBASE_ADMIN_*`.

Protected API routes verify Firebase ID tokens.

## Daily Refresh

Vercel Cron is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-refresh",
      "schedule": "0 2 * * *"
    }
  ]
}
```

Manual test:

```bash
curl -H "x-cron-secret: YOUR_SECRET" http://localhost:3000/api/cron/daily-refresh
```

## AI Agent Architecture

Agents live in `/agents`:

- Search Agent
- Extraction Agent
- Verification Agent
- Categorization Agent
- Priority Ranking Agent
- Student Summary Agent
- Agent Orchestrator

The current pipeline is production-shaped and runs safely with trusted seed data. Add live source adapters gradually inside `agents/search-agent.ts`.

## Deploy To Vercel

1. Push this folder to GitHub.
2. Import the repository in Vercel.
3. Add all environment variables.
4. Deploy.
5. Confirm `/api/cron/daily-refresh` succeeds with `CRON_SECRET`.

## Trust Rules

- Show only active verified jobs.
- Redirect applications to official sources only.
- Do not invent salary, deadline, or eligibility.
- Remove suspicious, duplicate, expired, and promotional listings.
- Keep confidence scoring visible to students.
