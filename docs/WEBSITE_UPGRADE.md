# OM Car Inspection Website Upgrade

## Scope delivered

The marketing website now uses dedicated route pages and a shared frosted-glass capsule navigation. The actual inspection application remains in its existing Next.js dashboard; the former iframe prototype is no longer the `/admin` destination.

## 30 core SEO landing pages

1. **Used-car inspection** — `/services/used-car-inspection`
2. **New-car PDI** — `/services/new-car-pdi`
3. **Used-vehicle PDI** — `/services/used-car-pdi`
4. **Pre-purchase inspection** — `/services/pre-purchase-inspection`
5. **Vehicle diagnostics** — `/services/vehicle-diagnostics`
6. **Inspection reports** — `/services/inspection-report`
7. **Vehicle condition assessment** — `/services/vehicle-condition-assessment`
8. **Fleet vehicle inspection** — `/services/fleet-vehicle-inspection`
9. **Dealer inspection support** — `/services/dealer-inspection-support`
10. **Independent car inspection** — `/services/independent-car-inspection`
11. **Used-car inspection checklist** — `/guides/used-car-inspection-checklist`
12. **New-car PDI checklist** — `/guides/new-car-pdi-checklist`
13. **Tyre and wheel checks** — `/guides/tyre-and-wheel-checks`
14. **Paint and bodywork checks** — `/guides/paint-and-bodywork-checks`
15. **Engine-bay inspection guide** — `/guides/engine-bay-inspection-guide`
16. **Underbody inspection checks** — `/guides/underbody-inspection-checks`
17. **Road-test observations** — `/guides/road-test-observations`
18. **Documents and vehicle identity** — `/guides/documents-and-vehicle-identity`
19. **Understanding OBD codes** — `/guides/understanding-obd-codes`
20. **What goes in an inspection report** — `/guides/what-goes-in-inspection-report`
21. **Inspection duration** — `/guides/how-long-does-inspection-take`
22. **Inspection vs servicing** — `/guides/inspection-vs-regular-service`
23. **Used-car buying checklist** — `/guides/used-car-buying-checklist`
24. **Visible accident-repair signs** — `/guides/accident-damage-signs`
25. **Possible water-damage signs** — `/guides/water-damage-signs`
26. **Reviewing vehicle photos** — `/guides/how-to-review-vehicle-photos`
27. **Inspection scoring explained** — `/guides/vehicle-inspection-scoring-explained`
28. **Preparing a car for PDI** — `/guides/how-to-prepare-car-for-pdi`
29. **First-time buyer inspection tips** — `/guides/inspection-for-first-time-buyers`
30. **Learning vehicle inspection skills** — `/guides/car-inspector-career-guide`

Additional guide routes also ship: `/guides/pre-delivery-inspection-basics`, `/guides/visual-inspection-limits`, `/guides/vehicle-inspection-photo-checklist`, `/guides/service-history-review`, `/guides/brakes-and-suspension-observations`, `/guides/interior-and-electrical-checks`, `/guides/inspection-priority-levels`, `/guides/preparing-for-independent-inspection`, and `/guides/vehicle-inspection-for-fleet-managers`.

Dedicated public routes are also present for `/`, `/services`, `/guides`, `/masterclass`, `/about`, `/contact`, `/faq`, `/privacy`, `/book-inspection` and `/book-masterclass`.

## 50 animation and interaction effects

These are lightweight native CSS/React implementations inspired by categories in the public React Bits catalogue. They are not 50 separately installed third-party WebGL demos. This keeps the pages responsive on typical mobile devices.

1. Hero background image crossfade between three scenes, synchronized with the changing second headline line.
2. Slow hero-image zoom and de-saturation transition.
3. Fixed first headline line paired with a re-entering second headline phrase.
4. Reflective gradient sweep across the changing hero phrase.
5. Hero caption fade-up micro animation.
6. Drifting technical grid background.
7. Low-contrast ambient radial glow that breathes gently.
8. Two thin orbital rings rotate at different speeds.
9. Glass scan panel levitation with a restrained 3D treatment.
10. Shiny glass panel sweep across the scan panel.
11. Horizontal scan-light sweep through the car illustration.
12. Floating outlined car silhouette.
13. Pointer-following radial spotlight inside eligible cards.
14. Top-of-page scroll progress indicator with a gradient fill.
15. Glossy highlight on the black capsule navigation.
16. Repeated capsule-glass shimmer sweep.
17. Navigation link lift on hover.
18. Active capsule-link treatment based on the current route.
19. Mobile navigation panel fade-and-slide entrance.
20. Button gloss sweep on hover.
21. Button elevation and shadow response on hover.
22. Button arrow micro-nudge on hover.
23. Hero bottom scroll cue with a drawing line.
24. IntersectionObserver-triggered section reveal.
25. Blur-to-clear section reveal.
26. Staggered reveal timing for cards and checklist rows.
27. Service card hover lift.
28. Service card shadow and border transition.
29. Service photograph zoom on hover.
30. Service photograph saturation transition on hover.
31. Service card index medallion.
32. Service icon colour shift.
33. Inspection-report visual with perspective tilt on hover.
34. Floating evidence badge over the report illustration.
35. Glint sweep over the report evidence tiles.
36. Animated evidence-line placeholders inside the report visual.
37. Masterclass background glow that breathes gently.
38. Masterclass rows nudge horizontally on hover.
39. Training day number styling and accent contrast.
40. Guide card hover lift.
41. Guide card border and shadow transition.
42. FAQ accordion height transition.
43. FAQ plus icon rotate-to-close transition.
44. FAQ answer reveal with a grid-row transition.
45. Checklist number tile hover feedback.
46. Related-card arrow rise and lift.
47. Footer navigation link horizontal movement.
48. Page-level fade-in on page navigation.
49. Reduced-motion mode disables long decorative animation and reveals content immediately.
50. Sticky frosted-glass capsule header with backdrop blur and saturated border highlights.

## 20 UX, navigation and SEO features

1. Direct page links for each top navigation item rather than same-page anchor-only navigation.
2. Public software link targets the existing /dashboard application route.
3. /admin forwards to the real /dashboard route rather than embedding the legacy prototype.
4. Responsive navigation switches to a touch-friendly mobile panel.
5. Services index links to separate service landing pages.
6. Guides index links to unique educational articles.
7. Dedicated masterclass page with a six-day schedule.
8. Dedicated inspection enquiry form.
9. Dedicated masterclass enquiry form.
10. Booking details are prepared for a WhatsApp enquiry and are not falsely described as a confirmed booking.
11. Unique HTML title metadata for service and guide routes.
12. Unique meta descriptions for service and guide routes.
13. Canonical URL metadata for index and detail pages.
14. Open Graph and Twitter metadata for social sharing.
15. Service, Article and WebPage JSON-LD where applicable.
16. FAQPage JSON-LD based on each page's visible FAQs.
17. Breadcrumb navigation with links.
18. Dynamic sitemap with all service and guide URLs.
19. Robots metadata and a robots.txt route keep authenticated app routes out of the marketing sitemap.
20. Privacy information page explaining how enquiry handoff works.

## SEO caveats

Each core service/guide route has a unique title, meta description, canonical path, main heading, substantial route-specific content, FAQ text and contextual internal links. This is a technical and content foundation, not a guarantee of rankings. Search visibility still depends on factual business information, page experience, backlinks, competition and ongoing content quality.

## Reference

- React Bits: https://reactbits.dev/
- Text animations: https://reactbits.dev/c/text-animations
- Animations: https://reactbits.dev/c/animations
- Backgrounds: https://reactbits.dev/c/backgrounds

## Booking and authentication

Booking form submit opens a WhatsApp enquiry; it does not store data or automatically create an appointment. The real dashboard remains at `/dashboard`, where the app's existing authentication and database controls continue to apply. No new password gate was added to the public mock or marketing routes.