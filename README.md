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
7. Provision staff accounts through Supabase Auth administration. Public self-sign-up is disabled. Sign in at `/login`; authorised staff land in `/dashboard`.
8. Apply `supabase/migrations/202610040001_om_car_inspection_production.sql` to the dedicated project.

## Database and security

The schema is multi-tenant. Structured data lives in PostgreSQL, original evidence lives in private Storage buckets, and published reports use immutable snapshots.

RLS is enabled on application and reference tables. Staff access is verified against active organisation memberships, never user-editable metadata. Public booking and report verification use narrowly scoped database RPCs; no service-role key is needed in the browser.

Do not apply this migration to an existing Supabase project that contains unrelated application tables. Create a dedicated project or use an explicitly isolated schema strategy first.

## Required production secrets

`NEXT_PUBLIC_SUPABASE_URL`
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
`SUPABASE_SERVICE_ROLE_KEY` (optional for trusted maintenance scripts only; never expose it to the browser)
`NEXT_PUBLIC_APP_URL`
`OMCAR_ADMIN_RPC_SECRET` (server-only HMAC signing secret for the separate `/admin` portal)

Optional integrations:
`OPENAI_API_KEY`, `OPENAI_MODEL`
`VEHICLE_LOOKUP_PROVIDER`
`DECENTRO_CLIENT_ID`, `DECENTRO_CLIENT_SECRET`
`VEHICLE_LOOKUP_URL`
`SUREPASS_API_KEY`
`VEHICLE_PROVIDER_URL`, `VEHICLE_PROVIDER_TOKEN`
`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_OTP_TEMPLATE`, `WHATSAPP_OTP_LANGUAGE`, `WHATSAPP_GRAPH_API_VERSION`
`RESEND_API_KEY`, `EMAIL_FROM`
`SENTRY_DSN`

## Production path

Login → organization → dashboard → vehicle identity → chassis/VIN lookup → automatic vehicle prefill → 7-stage inspection → evidence → deterministic scoring → reviewer controls → immutable report version → Print PDF → optional supporting-PDF merge → QR verification → customer sharing.

### India vehicle lookup

The vehicle identity stage supports a server-side chassis/VIN lookup adapter. The default integration uses a chassis-to-RC provider contract and keeps credentials on the server. The UI automatically attempts lookup after a sufficiently complete chassis number is entered, while still allowing manual lookup and manual correction.

For providers that require consent, the inspection flow should be used only for an authorized business/verification purpose. Current provider documentation shows chassis-to-RC/vehicle verification services and, for Decentro's chassis endpoint, an explicit consent and purpose in the request.

## AI rule

AI can rewrite supplied inspection facts into professional language. It must not invent findings, vehicle data, measurements, scores, safety conclusions, or final recommendations.

## Verification

Run:
```bash
npm run typecheck
npm run build
```

The repository also contains GitHub Actions CI configuration for those checks.


## Administrator portal

- `/admin` is a separate, mobile-first admin console with animated React/GSAP interactions, workspace metrics, and account-security settings.
- Admin credentials are stored as a salted scrypt hash in the private Supabase schema. The server issues an HttpOnly, SameSite session cookie with a 12-hour expiry, applies failed-login throttling, and revokes other sessions when credentials change.
- Credential changes require a one-time code delivered to the configured WhatsApp number. Delivery uses the WhatsApp Cloud API and an approved message template; the app does not simulate or display an OTP.
- Configure `OMCAR_ADMIN_RPC_SECRET` in Vercel as a sensitive server environment variable and in the private admin configuration row in Supabase. Never expose or commit this value.
- WhatsApp verification also requires `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and an approved `WHATSAPP_OTP_TEMPLATE` with one body text-code placeholder. Until these are configured, credential changes stay disabled.
- `/login` and `/dashboard` retain their existing Supabase staff-authentication flow. The admin console does not bypass staff membership checks or change site domains, SSO protection or other Vercel settings.

## Public marketing website

The root route is the public OM Car Inspection website. Dedicated route pages are provided for services and inspection guides. The long glass capsule navigation links to separate pages and to the real dashboard application.

- /services — service index
- /services/[slug] — independent service landing pages
- /guides — education and checklist index
- /guides/[slug] — unique SEO guide pages
- /masterclass — six-day practical learning outline
- /book-inspection and /book-masterclass — enquiry forms that hand off to WhatsApp; they do not themselves reserve an appointment
- /dashboard — the existing authenticated inspection application
- /admin — forwards to /dashboard; the old static prototype iframe is removed

The marketing site includes page-specific title tags, descriptions, canonical paths, Open Graph/Twitter metadata, JSON-LD, sitemap and robots routes. See docs/WEBSITE_UPGRADE.md for the feature inventory and animation reference list.

## Public website and private staff portal

- Public business website: `/` (vehicle inspections, PDI training, service evidence and enquiry forms).
- Private staff sign-in: `/login`.
- Private staff application: `/dashboard`.
- Separate admin control panel: `/admin` (its own server-verified admin session and settings).
- Booking requests submitted on the public website are stored in `booking_requests` and can be managed by workspace administrators at `/requests`.
- Public visitors cannot read booking records or enter the inspection dashboard. Private pages and APIs fail closed when authentication or an active staff membership cannot be verified.
- Inspection creation and report finalisation use transactional database functions. Completed report snapshots are not overwritten; public report links expire after one year and can be revoked by an administrator.

The website and staff application share the same deployment but use separate routes and access controls. The staff portal is not linked from the primary navigation; the footer contains a discreet staff sign-in link.
