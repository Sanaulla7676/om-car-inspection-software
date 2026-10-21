# Security review and local validation

Review date: 2026-10-21

This is a code-level review plus local HTTP checks. It is not a penetration-test certification. Production database policy, deployment routing and provider credentials could not be fully exercised because this local environment has no configured Supabase secrets.

## Checks and mitigations applied

| Area / abuse case | Mitigation in this revision | Local check / remaining detail |
| --- | --- | --- |
| Cross-origin enquiry spam / CSRF-style submission | The public booking route compares an included Origin to the request Host; it has a honeypot, server-side field checks and normalizes/truncates user fields. | Malicious Origin returned 403. Requests without an Origin header are still accepted, so only allow those for intentional non-browser clients. |
| Oversized JSON or chunked request body | Streamed body readers enforce byte caps even if Content-Length is absent or dishonest. Public booking is capped at 12 KB; inspection drafts at 1 MB; registry input at 4 KB. | 13 KB public enquiry returned 413; a chunked request with no Content-Length also returned 413. |
| Malformed JSON | JSON is parsed only after bounded read and checked for the expected object shape. | Malformed public enquiry returned 400. Inspection draft checks draft and vehicle object shapes before use. |
| Server-side request forgery through vehicle registry configuration | Provider URL comes from server environment, never from request payload; requires HTTPS, rejects credentials/nonstandard ports, rejects obvious local/private destinations, disallows redirects and applies a 12-second timeout. | Code review complete. The hostname check does not perform DNS pinning, so production egress/DNS controls remain recommended. Known Decentro and Surepass adapters require their expected hosts. |
| Registry provider returning a huge/hanging response | Response body capped at 1 MB and fetch timed out after 12 seconds. | Typecheck/build coverage; no provider credentials were available to exercise a real upstream response. |
| PDF merge memory exhaustion | Both merge endpoints stream-read within total request limits; enforce per-file, per-count and aggregate byte limits before parsing/merging; malformed multipart forms fail with 400. | Typecheck/build coverage. A genuine authenticated PDF merge cannot be end-to-end tested without Supabase credentials. |
| Cross-tenant report ID access | Report merge uses the staff authorization helper and scopes the report query to the active organization. Customer, vehicle, report and inspection reads are likewise organization-scoped. | Code review only for live RLS policies; local Supabase is not configured. Verify the corresponding Postgres RLS rules and RPC authorization in the deployed project. |
| Role bypass on PDF merge | Merge endpoints use the staff-context authorization helper rather than accepting any signed-in Supabase user. | Typecheck/build coverage. Role/membership behaviour needs integration tests against the production-like database. |
| Sensitive report PDF cached by intermediary/browser | Public and staff PDF responses use private no-store cache headers; public verification response is no-store. | Verify headers against the deployed domain/CDN as well. |
| Error-message information leakage | Inspection GET returns a generic service error rather than forwarding raw database error text. | Code-level check. |
| Clickjacking / MIME sniffing / referrer and permission leakage | Next.js headers configure X-Frame-Options SAMEORIGIN, X-Content-Type-Options nosniff, strict-origin-when-cross-origin Referrer-Policy and a restrictive Permissions-Policy. HSTS is production-only. | Headers verified on localhost except HSTS, which is intentionally production-only. |
| Dependency vulnerabilities | npm audit --omit=dev --audit-level=high completed with zero reported vulnerabilities in production dependencies. | This result is specific to the lockfile/package state at review time; rerun for future updates. |

## Local regression results

- npm run typecheck: passed after the security changes.
- Intro assets serve successfully as video/mp4: desktop source 1280×720, mobile source 720×1280.
- Browser QA confirmed desktop/mobile video source selection, video playback, Skip action, session dismissal, homepage path cards and road scene. The mobile page width remained 390 px without horizontal overflow.
- Public booking HTTP probes: foreign Origin 403, invalid JSON 400, over-limit body 413, chunked no-Content-Length over-limit body 413.
- Homepage, new guide pages, masterclass page and about page returned HTTP 200 during local route checks.
- npm audit --omit=dev --audit-level=high: zero vulnerabilities reported.

## Remaining production hardening

1. Add distributed rate limiting (and, if real abuse appears, CAPTCHA or equivalent) to public enquiries; the honeypot/origin/body checks alone do not stop a distributed botnet.
2. Validate Supabase RLS and every security-definer RPC (create_inspection, public booking, report-token lookup/revoke) in a staging project using different organizations and roles. Check expiry and revocation of report tokens and signed media URLs.
3. Configure and test a Content-Security-Policy in staging. A safe CSP needs a verified allowlist for Next.js assets, Google Fonts and the actual Supabase/media origins; do not copy a guessed policy into production.
4. Validate reverse-proxy Host/forwarded-header sanitization and add outbound network egress restrictions for the vehicle-registry integration.
5. Run authenticated integration tests for inspection creation, report generation, PDF merge upload limits, organization switching, and token expiry/revocation with non-production credentials.
6. Confirm the hosting platform has a request-body limit compatible with the 52 MB standalone and 126 MB report-merge caps. Platform limits can be lower than application limits.
