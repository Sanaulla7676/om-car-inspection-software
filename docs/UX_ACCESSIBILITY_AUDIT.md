# OM Car Inspection: UI, Contrast and User-Experience Audit

**Audit date:** 13 October 2026  
**Target:** `Sanaulla7676/om-car-inspection-software`, production-facing Next.js application  
**Scope:** source review of the shared application shell, dashboard styles, sign-in/sign-up experience, and inspection wizard, plus a live response check of the public sign-in route.

## Executive summary

The application has a clear navy-and-teal visual direction and a substantive inspection workflow, but its interface uses a compact dashboard density that has crossed into poor readability. Several labels, helper texts, data-table annotations, and chart labels use 7–10 px type. Many muted foreground colors do not reach WCAG AA contrast for normal-sized text. Interactive controls also use small padding and weak focus rings. These issues matter during field inspections, where users may work on phones, in bright environments, or while moving quickly through checklists.

## Findings and severity

| Priority | Finding | Evidence in current source | User impact |
|---|---|---|---|
| P0 | Normal text contrast fails WCAG AA in sampled styles | `#7f8999` on white = 3.53:1; `#929daa` on white = 2.75:1; `#98a2af` on white = 2.59:1; `#9aa3b0` on white = 2.55:1 | Helper copy and key annotations become difficult to read, especially on mobile or in glare |
| P0 | Some informative accent graphics are too faint on white | `#24bdc7` on white = 2.29:1 | Thin chart marks/icons can disappear for users with reduced contrast sensitivity |
| P1 | Typography is consistently undersized | Dashboard CSS uses 7–9 px for chart axes, table headers, secondary labels and small notes; wizard uses 7 px consent text, 8 px lookup/meta copy, 9 px labels and 10–11 px fields | More scanning effort, slower error detection, and avoidable zooming |
| P1 | Inputs blend into the surface | Several field borders are around `#dfe6ee` and focus styling uses a low-opacity cyan ring | Users may miss where to type or which field is active |
| P1 | Touch targets are too compact in dense flows | Buttons and evidence controls use 6–9 px padding and 7–10 px text in many places | More mis-taps on phones and tablets |
| P1 | Sign-in fields rely on placeholders as their only visible labels | The live login form displayed email/password placeholders without persistent field labels | The field purpose is less obvious once text is entered; placeholder contrast also needed improvement |
| P2 | Color is carrying too much of the visual signal | Teal/cyan, gray, amber and success colors are used at low contrast around otherwise low-density boundaries | Important actions, status text and decorative elements are harder to distinguish consistently |
| P2 | Keyboard focus is not consistently prominent | Shared global focus treatment is subtle and sometimes moves the field instead of strongly outlining it | Keyboard-only navigation is harder to track |

## Sampled contrast measurements

Ratios below were calculated from foreground/background colors defined in the source, using WCAG relative luminance. They are not a claim that every rendered state was pixel-tested.

| Foreground | Background | Ratio | Assessment for normal text |
|---|---|---:|---|
| `#7f8999` | `#ffffff` | 3.53:1 | Fail |
| `#8b95a2` | `#f8f9fb` | 2.88:1 | Fail |
| `#929daa` | `#ffffff` | 2.75:1 | Fail |
| `#98a2af` | `#ffffff` | 2.59:1 | Fail |
| `#9aa3b0` | `#ffffff` | 2.55:1 | Fail |
| `#24bdc7` | `#ffffff` | 2.29:1 | Fail for meaningful graphical elements |
| `#b47919` | `#fff5e5` | 3.42:1 | Fail |
| `#244b78` | `#ffffff` | 8.93:1 | Pass |

WCAG AA generally requires 4.5:1 for normal text and 3:1 for large text. Meaningful graphical controls and state indicators should be distinguishable from adjacent colors at 3:1 where that criterion applies.

## Solution implemented

1. **Contrast tokens:** replaced low-contrast muted foregrounds with a consistent slate (`#536277`, sampled at 6.21:1 on white and 5.90:1 on `#f8f9fb`), dark teal (`#0b7280`, 5.63:1 on white), and readable success/warning colors. Navy remains the strong primary surface.
2. **Typography hierarchy:** raised dashboard microcopy, navigation, table headers and annotations to a 12–13 px minimum; strengthened page, section and field labels; increased wizard helper copy, controls and input text.
3. **Form usability:** added persistent visible labels for name/email/password on sign-in/sign-up, improved placeholder contrast, and retained existing password visibility behavior. Error and success messages now expose alert/status semantics.
4. **Touch targets and fields:** gave common navigation, form controls, wizard steps, evidence actions and primary actions at least a 44 px target where practical; strengthened field borders and focus rings.
5. **Keyboard and motion:** applied a consistent, high-visibility `:focus-visible` outline and retained reduced-motion support.
6. **Responsive behavior:** improved small-screen toolbar wrapping, horizontal wizard-step scrolling and mobile spacing without changing inspection/business logic.

## Verification limits and next checks

- The source and public sign-in route were reviewed. The live authenticated dashboard, upload flows, and report-publishing interactions were not exercised with a real user session, so this is a code-and-style audit, not a complete assistive-technology or end-to-end certification.
- Contrast ratios recorded above are calculated from representative source colors. A final browser audit should test the full rendered set of states, zoom, forced-colors/high-contrast mode, and keyboard/screen-reader flow.
- The change is visual/accessibility-focused and does not alter scoring rules, registry integrations, database schema, authentication policy, or report data.

## Files changed

- `app/globals.css`: appended system-wide contrast, type, focus, form, touch-target and responsive refinements.
- `components/auth-experience.tsx`: added persistent field labels and accessible live-region semantics for feedback.
- `docs/UX_ACCESSIBILITY_AUDIT.md`: this audit and remediation record.

## Acceptance checklist

- [x] Normal text palette sampled against WCAG AA target.
- [x] Visible labels added to authentication fields.
- [x] Focus-visible state is explicit and consistent.
- [x] Common controls have larger interaction targets.
- [x] Mobile layouts received targeted spacing and overflow adjustments.
- [ ] Run the repository typecheck/build and inspect the resulting production deployment.
- [ ] Validate the authenticated flows with keyboard-only navigation and screen-reader testing.