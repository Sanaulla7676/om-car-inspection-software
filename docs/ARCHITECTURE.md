# OM Car Inspection — Production Architecture

## Product flow

Users → Next.js Web Dashboard / Mobile PWA → Offline Layer → Server/API → Supabase → External integrations → Report → Customer verification.

The field workflow remains the prototype's 11-step sequence:

1. Setup
2. Vehicle
3. Exterior
4. Interior
5. Mechanical
6. Electrical
7. Tyres
8. Test Drive
9. Faults
10. Photos
11. Summary

## Runtime architecture

```
Admin / Reviewer / Inspector / Customer
                  |
                  v
       Next.js + React + TypeScript
       |                       |
       |                       +--> Customer report / QR verify
       |
       +--> Mobile-first PWA
                  |
        +---------+---------+
        |                   |
   Online path          Offline path
        |                   |
        v                   v
  API / Server        IndexedDB + Dexie
        |              + Outbox Queue
        |              + Draft cache
        |              + Media cache
        |                   |
        +---------sync------+
                  |
                  v
        Supabase Auth + PostgreSQL
        + RLS + Storage + Realtime
        + Edge Functions
                  |
        +---------+----------+-----------+
        |                    |           |
   Vehicle provider        AI        WhatsApp/Email
        |
        v
    Report snapshot
        |
        v
    PDF + QR verification
```

## Data ownership

- PostgreSQL is the source of truth for structured inspection data.
- Supabase Storage is the source of truth for original evidence files.
- IndexedDB is a temporary offline working store and outbox.
- Published report versions are immutable snapshots.
- Scoring is deterministic and server-controlled.
- AI may rewrite supplied facts but never creates findings, scores, measurements, vehicle identity, or final safety decisions.

## Repository tree

```
om-car-inspection-software/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── [module]/
│   │   └── inspections/new/
│   ├── api/
│   │   ├── me/
│   │   ├── inspections/
│   │   ├── ai/summary/
│   │   ├── reports/
│   │   ├── verify/
│   │   └── public-reports/
│   ├── onboarding/
│   ├── report/[token]/
│   └── verify/[token]/
├── components/
│   ├── app-shell.tsx
│   ├── inspection-wizard.tsx
│   └── pwa-register.tsx
├── lib/
│   ├── supabase/
│   ├── scoring.ts
│   ├── offline.ts
│   ├── types.ts
│   └── demo-data.ts
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icon.svg
├── supabase/
│   ├── migrations/
│   └── functions/
├── docs/
│   └── ARCHITECTURE.md
└── .github/workflows/ci.yml
```

## Production controls

- Multi-tenant organization isolation with RLS.
- Role-based authorization.
- Server-only secrets.
- Private Storage buckets.
- Audit logging.
- Offline autosave and synchronized drafts.
- Idempotent sync operations.
- Immutable report versions.
- Secure report tokens hashed before storage.
- Public verification exposes limited metadata only.
- CI runs TypeScript typecheck and production build when GitHub Actions is available.

## Required external configuration

Create a dedicated Supabase project for OM Car Inspection rather than reusing a project that contains unrelated application tables.

Required values:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_APP_URL

Optional provider credentials:
- OPENAI_API_KEY / OPENAI_MODEL
- VEHICLE_PROVIDER_URL / VEHICLE_PROVIDER_TOKEN
- WHATSAPP_ACCESS_TOKEN / WHATSAPP_PHONE_NUMBER_ID
- RESEND_API_KEY / EMAIL_FROM
- SENTRY_DSN
