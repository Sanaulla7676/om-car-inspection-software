# OM Car Inspection: 80 interaction animation effects

These 80 lightweight effects supplement the existing GSAP scroll reveals, hero crossfade, capsule navigation, form calendar, card transitions, and logo/contact animations. They are interaction-triggered (hover, focus, selected, or status), not 80 continuous loops. All are covered by `prefers-reduced-motion`.

| # | Effect | Integrated target | Behaviour |
|---:|---|---|---|
| 1 | Hero selector 01 lift | `.lux-sync-slide-nav button:nth-child(1):hover` | A tiny upward lift for the first hero selector. |
| 2 | Hero selector 02 nudge | `.lux-sync-slide-nav button:nth-child(2):hover` | A sideways nudge for the second hero selector. |
| 3 | Hero selector 03 pop | `.lux-sync-slide-nav button:nth-child(3):hover` | A soft scale pop for the coaching selector. |
| 4 | Hero selector keyboard focus | `.lux-sync-slide-nav button:focus-visible` | A restrained keyboard-focus pulse. |
| 5 | Hero primary CTA | `.lux-car-hero-primary:hover` | A quick lift and settle on the primary CTA. |
| 6 | Hero secondary CTA | `.lux-car-hero-secondary:hover` | A gentle side-to-side action nudge. |
| 7 | Hero primary arrow | `.lux-car-hero-primary:hover svg` | The primary CTA arrow makes a short forward movement. |
| 8 | Hero secondary arrow | `.lux-car-hero-secondary:hover svg` | The secondary CTA arrow rotates slightly. |
| 9 | Hero slide counter | `.lux-sync-counter:hover` | A short counter tilt on hover. |
| 10 | Hero proof icon | `.lux-car-hero-proof svg:hover` | A small proof-icon bounce. |
| 11 | Logo hover polish | `.luxury-brand:hover .lux-brand-logo-img` | A subtle scale settle on the brand logo. |
| 12 | Home capsule | `.luxury-nav-link:nth-of-type(1):hover` | The Home capsule makes a small horizontal nudge. |
| 13 | New PDI capsule | `.luxury-nav-link:nth-of-type(2):hover` | The New PDI capsule lifts on hover. |
| 14 | Pre-Owned capsule | `.luxury-nav-link:nth-of-type(3):hover` | The Pre-Owned capsule gets a gentle pop. |
| 15 | Coaching capsule | `.luxury-nav-link:nth-of-type(4):hover` | The Coaching capsule tilts subtly. |
| 16 | Valuation capsule | `.luxury-nav-link:nth-of-type(5):hover` | The Valuation capsule gets a short left-right glide. |
| 17 | Reports capsule | `.luxury-nav-link:nth-of-type(6):hover` | The Reports capsule gets a small bounce. |
| 18 | Search icon | `.lux-header-icon[aria-label="Explore services"]:hover` | A small search-control scale pulse. |
| 19 | Sign-in icon | `.lux-header-icon[aria-label="Open sign-in"]:hover` | A restrained sign-in icon rotate. |
| 20 | Login button | `.lux-header-login:hover` | The login button gets a soft highlight pulse. |
| 21 | Mobile menu toggle | `.site-mobile-toggle:hover` | The mobile menu icon gets a tiny lift. |
| 22 | Floating WhatsApp | `.lux-floating-whatsapp:hover` | The WhatsApp pill makes a soft upward nudge. |
| 23 | Floating call | `.lux-floating-call:hover` | The call pill gets a light scale settle. |
| 24 | Scroll progress bar | `.site-scroll-progress:hover #site-scroll-progress-fill` | A short scale response when the progress bar is hovered. |
| 25 | New PDI option | `.lux-inspection-type-option:nth-child(1):hover` | The New PDI choice raises slightly. |
| 26 | Pre-Owned option | `.lux-inspection-type-option:nth-child(2):hover` | The Pre-Owned choice shifts gently to the right. |
| 27 | Selected type check | `.lux-inspection-type-option.is-selected .lux-inspection-type-check` | The selected-state check pops into view. |
| 28 | Vehicle picker focus | `.lux-vehicle-entry:focus-within` | A short focus-state lift on the vehicle control. |
| 29 | Vehicle chooser button | `.lux-vehicle-entry > button:hover` | The vehicle chooser icon button rotates subtly. |
| 30 | Vehicle example 1 | `.lux-vehicle-suggestions > div > button:nth-child(1):hover` | The first example row gets a brief nudge. |
| 31 | Vehicle example 2 | `.lux-vehicle-suggestions > div > button:nth-child(2):hover` | The second example row gets a soft pop. |
| 32 | Vehicle example 3 | `.lux-vehicle-suggestions > div > button:nth-child(3):hover` | The third example row lifts briefly. |
| 33 | Vehicle example 4 | `.lux-vehicle-suggestions > div > button:nth-child(4):hover` | The fourth example row gets a horizontal glide. |
| 34 | Vehicle example 5 | `.lux-vehicle-suggestions > div > button:nth-child(5):hover` | The fifth example row gets a soft tilt. |
| 35 | Date trigger hover | `.lux-date-trigger:hover` | The calendar trigger responds with a short lift. |
| 36 | Calendar opened | `.lux-date-trigger[aria-expanded="true"]` | The opened calendar trigger gets a small open-state pop. |
| 37 | Previous month control | `.lux-calendar-header > button:first-child:hover` | The previous-month chevron nudges left. |
| 38 | Next month control | `.lux-calendar-header > button:last-child:hover` | The next-month chevron nudges right. |
| 39 | Calendar day column 1 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(1):not(:disabled):hover` | A slight lift on the first day-column control. |
| 40 | Calendar day column 2 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(2):not(:disabled):hover` | A scale pop on the second day-column control. |
| 41 | Calendar day column 3 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(3):not(:disabled):hover` | A short vertical bounce on the third day-column control. |
| 42 | Calendar day column 4 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(4):not(:disabled):hover` | A small tilt on the fourth day-column control. |
| 43 | Calendar day column 5 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(5):not(:disabled):hover` | A horizontal nudge on the fifth day-column control. |
| 44 | Calendar day column 6 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(6):not(:disabled):hover` | A quick settle on the sixth day-column control. |
| 45 | Calendar day column 7 | `.lux-calendar-grid:not(.lux-calendar-weekdays) > button:nth-of-type(7):not(:disabled):hover` | A gentle scale shimmer on the seventh day-column control. |
| 46 | Selected calendar date | `.lux-calendar-grid > button.is-selected` | The selected date receives a short confirmation pop. |
| 47 | Today marker | `.lux-calendar-grid > button.is-today` | Today's date gets a mild highlight pulse. |
| 48 | Calendar Done button | `.lux-calendar-footer > button:hover` | The Done action lifts to signal interaction. |
| 49 | Optional details disclosure | `.lux-inquiry-extra summary:hover` | The disclosure row slides subtly to the right. |
| 50 | Expanded optional details | `.lux-inquiry-extra[open] summary` | The open disclosure receives a brief reveal. |
| 51 | Customer field focus | `.lux-inspection-field input[name="customer"]:focus` | Customer field receives a small focus settle. |
| 52 | Phone field focus | `.lux-inspection-field input[name="phone"]:focus` | Phone field gets a distinct short focus pulse. |
| 53 | Vehicle field focus | `.lux-inspection-field input[name="vehicle"]:focus` | Vehicle text entry gets a soft scale-settle. |
| 54 | City field focus | `.lux-inspection-field input[name="city"]:focus` | City field gets a short horizontal glide. |
| 55 | Registration field focus | `.lux-inquiry-extra-fields input[name="registration"]:focus` | Registration field gets a short border-focus movement. |
| 56 | Notes field focus | `.lux-inquiry-extra-fields input[name="notes"]:focus` | Additional-notes field gets a slight focus bounce. |
| 57 | Booking submit hover | `.lux-inspection-submit:hover` | The primary booking action lifts lightly. |
| 58 | Booking submit press | `.lux-inspection-submit:active` | A short press-in and release effect. |
| 59 | Booking header icon | `.lux-inquiry-icon:hover` | The enquiry icon receives a quick rotate. |
| 60 | WhatsApp handoff status | `.lux-inquiry-status[role="status"]` | The handoff message fades in with a soft settle. |
| 61 | Model card 1 | `.lux-model-card:nth-child(1):hover` | A slight lift for the first model card. |
| 62 | Model card 2 | `.lux-model-card:nth-child(2):hover` | A gentle horizontal movement for the second model card. |
| 63 | Model card 3 | `.lux-model-card:nth-child(3):hover` | A soft scale pop for the third model card. |
| 64 | Model card 4 | `.lux-model-card:nth-child(4):hover` | A minimal rotation for the fourth model card. |
| 65 | Model card 5 | `.lux-model-card:nth-child(5):hover` | A light lift-and-settle for the fifth model card. |
| 66 | Model image 1 | `.lux-model-card:nth-child(1):hover .lux-model-image img` | A subtle zoom on the first model image. |
| 67 | Model image 2 | `.lux-model-card:nth-child(2):hover .lux-model-image img` | A short horizontal image pan on the second model. |
| 68 | Model image 3 | `.lux-model-card:nth-child(3):hover .lux-model-image img` | A gentle image scale pulse on the third model. |
| 69 | Model image 4 | `.lux-model-card:nth-child(4):hover .lux-model-image img` | A small image tilt on the fourth model. |
| 70 | Model image 5 | `.lux-model-card:nth-child(5):hover .lux-model-image img` | A subtle vertical image settle on the fifth model. |
| 71 | Service card 1 | `.lux-service-card:nth-child(1):hover` | An extra-low lift on the first service card. |
| 72 | Service card 2 | `.lux-service-card:nth-child(2):hover` | A short side sway on the second service card. |
| 73 | Service card 3 | `.lux-service-card:nth-child(3):hover` | A low-amplitude scale pop on the third service card. |
| 74 | Service card 4 | `.lux-service-card:nth-child(4):hover` | A short card tilt on the fourth service card. |
| 75 | Workflow step 1 | `.lux-process-step:nth-child(1):hover` | A subtle rise on the first workflow step. |
| 76 | Workflow step 2 | `.lux-process-step:nth-child(2):hover` | A horizontal nudge on the second workflow step. |
| 77 | Workflow step 3 | `.lux-process-step:nth-child(3):hover` | A quick soft pulse on the third workflow step. |
| 78 | Workflow step 4 | `.lux-process-step:nth-child(4):hover` | A small tilt on the fourth workflow step. |
| 79 | Masterclass day cards | `.masterclass-schedule-card:nth-child(odd):hover` | Odd-numbered day cards receive a brief lift. |
| 80 | Related service card | `.related-card:hover` | Related service cards respond with a soft rise. |