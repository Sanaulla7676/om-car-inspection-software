# OM Car Inspection

Production architecture and application conversion of the original AutoInspect Pro vehicle-inspection prototype.

## Architecture

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Supabase PostgreSQL + Auth + Storage + Realtime + Edge Functions
- PWA + IndexedDB/Dexie for offline-first field work
- Vercel for hosting
- Server-side PDF generation
- Secure server-side AI and external integration adapters

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the complete architecture and 11-step workflow.

## Run

1. Install Node.js 22+.
2. Copy `.env.example` to `.env.local`.
3. Create/use a **dedicated Supabase project for OM Car Inspection**.
4. Add its project URL and publishable key.
5. Install dependencies: `npm install`.
6. Start: `npm run dev`.
7. Create the first Auth user in Supabase, sign in, then open `/onboarding`.
8. Apply `supabase/migrations/202610040001_om_car_inspection_production.sql` to the dedicated project.

## Database and security

The schema is multi-tenant. Structured data lives in PostgreSQL, original evidence lives in private Storage buckets, and published reports use immutable snapshots.

RLS is enabled on application tables. Authorization data is stored in memberships rather than user-editable metadata. The service-role key is server-only.

Do not apply this migration to an existing Supabase project that contains unrelated application tables. Create a dedicated project or use an explicitly isolated schema strategy first.

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

## Production path

Login → organization → dashboard → assigned inspection → offline-capable 11-step inspection → evidence → deterministic scoring → reviewer controls → immutable report version → secure PDF → QR verification → customer sharing.

## AI rule

AI can rewrite supplied inspection facts into professional language. It must not invent findings, vehicle data, measurements, scores, safety conclusions, or final recommendations.

## Verification

Run:
```bash
npm run typecheck
npm run build
```

The repository also contains GitHub Actions CI configuration for those checks.
