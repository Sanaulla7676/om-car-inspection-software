# OM Car Inspection

Production conversion of the original AutoInspect Pro vehicle-inspection prototype.

## Architecture

Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
Supabase PostgreSQL + Auth + Storage + Realtime + Edge Functions
PWA + IndexedDB/Dexie for offline-first field work
Vercel for deployment
pdf-lib for server PDF generation
AI and external vehicle/WhatsApp/email integrations through secure server-side adapters

## Run

1. Install Node.js 22+.
2. Copy `.env.example` to `.env.local`.
3. Add the Supabase URL and publishable key from the OM project.
4. Install dependencies: `npm install`.
5. Start: `npm run dev`.
6. Create your first Auth user in Supabase, sign in, then create the organization at `/onboarding`.

## Supabase

Project ref: `ypkusdcdlbhhlydglado`.
Database migration: `supabase/migrations/202610040001_om_car_inspection_production.sql`.

The migration enables RLS on all exposed application tables, creates private helper functions for tenant membership checks, creates private Storage buckets, and seeds a global fault library, scoring rules and starter templates.

## Required production secrets

`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
`SUPABASE_SERVICE_ROLE_KEY` (server only)
`NEXT_PUBLIC_APP_URL`

Optional integrations:
`OPENAI_API_KEY`, `OPENAI_MODEL`
`VEHICLE_PROVIDER_URL`, `VEHICLE_PROVIDER_TOKEN`
`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
`RESEND_API_KEY`, `EMAIL_FROM`
`SENTRY_DSN`

## Security rules

Never expose the service-role/secret key in browser code. RLS is the tenant isolation boundary. AI may rewrite supplied facts, but never invent inspection findings, final scores or safety conclusions. Original evidence is retained separately from optimized report copies.

## Production path

Login → organization → dashboard → assigned inspection → offline-capable 11-step inspection → evidence → deterministic scoring → review controls → immutable report version → secure PDF → QR verification → WhatsApp/email/secure link.

## Verification

Use `npm run typecheck` and `npm run build` before deployment. Use Playwright for end-to-end tests of login, inspection creation, offline draft recovery, evidence upload, finalization and report verification.
