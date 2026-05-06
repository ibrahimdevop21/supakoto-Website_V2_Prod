# SupaKoto Tracking Audit Report

*Generated: 2026-05-06 — Phase 1 (audit only, no code changes)*
*Scope: supakoto.com production site, branch `main` at commit `84cb28d`*

---

## Executive Summary

The site has **only one third-party tracking conduit installed in code: Google Tag Manager (`GTM-PKSH2C5K`)** plus Vercel Analytics. There is **no direct Meta Pixel, no direct GA4, and no direct Google Ads gtag conversion code** anywhere in the source — every paid-media tag depends entirely on whatever is configured inside the GTM container's web UI. That single point of failure explains the symptoms exactly: GA4 works because GTM has a working GA4 tag, but Meta Pixel is "partial" and Google Ads has zero conversions because their tags inside GTM are either missing, misconfigured, or not wired to the right events. A secondary problem is that several event call-sites bypass the central `src/lib/track.ts` helper and push to `dataLayer` directly with inconsistent event names and parameter shapes, making GTM-side trigger configuration brittle.

**TL;DR fix priority:** add direct `gtag` Google Ads conversion tracking to `Layout.astro` (no GTM dependency), add direct Meta Pixel base code + standard event mapping to `Layout.astro`, then converge all client-side event firing through `src/lib/track.ts`.

---

## Tag Inventory

| System | ID present in code | Loaded directly in HTML | Loaded via GTM | Status |
|---|---|---|---|---|
| **Google Tag Manager** | `GTM-PKSH2C5K` (Layout.astro:369, 375) | ✅ on every page | n/a | **Working** — verified by curl on `/`, `/contact`, `/ar`, `/ar/contact`, `/gallery`, `/services` (3 occurrences each: head script + noscript iframe + comments) |
| **Vercel Analytics** | injected via `@vercel/analytics` (Layout.astro:400) + server-side via `@vercel/analytics/server` in API routes | ✅ via dynamic `import()` (bundled into `_astro/Layout.astro_astro_type_script_index_*.js`) | n/a | **Working** — confirmed by user (~1.7k events/month) |
| **Vercel Speed Insights** | `@vercel/speed-insights` (Layout.astro:404) | ✅ via dynamic `import()` | n/a | Working (out of scope) |
| **GA4** | NO direct `G-XXXXXXX` ID in source. NO `gtag.js` script. NO `gtag()` calls (except guarded fallback in ContactForm.astro:730) | ❌ Not loaded directly | **Loaded by GTM tag** (per user "GA4 firing events") | Working *because* of GTM tag — config invisible to this audit |
| **Meta Pixel** | NO `fbq('init', PIXEL_ID)` anywhere. NO direct `fbevents.js`. Only `connect.facebook.net` preconnect hint (Preload.astro:18) and one guarded `fbq('track','Lead',...)` fallback (ContactForm.astro:729) | ❌ Not loaded directly | Presumed loaded by GTM (unverified) | **Broken / partial** — fbq fallback calls silently fail if GTM hasn't loaded fbq |
| **Google Ads** | NO `AW-XXXXXXXXX` ID anywhere. NO direct `gtag('config', 'AW-...')`. NO conversion labels. | ❌ Not loaded directly | Unknown — would need GTM container access | **Broken** — explains zero conversions on 21,060 EGP spend |
| **TikTok Pixel** | NO `ttq` init anywhere. Only `analytics.tiktok.com` preconnect hint (Preload.astro:19) and stubbed `trackTikTok()` no-op functions in ActionPills.tsx:7 and StaticBranchCards.tsx:5. Code comments say "TikTok is disabled" | ❌ Not loaded | Unknown | **Disabled by design** |
| **Tactful Chat** | Profile ID `954`, token in `.env.example` (and falls back hardcoded in TactfulChat.astro:3-4 and TactfulWidget.astro:96-97) | ❌ NOT loaded — `TactfulWidget.astro` is fully wrapped in an HTML comment (`<!-- TACTFUL WIDGET DISABLED ... -->` from line 6 to 122). The script src in served HTML is inside that comment block. | n/a | Disabled |
| Hotjar / Microsoft Clarity / Snapchat Pixel | none | none | n/a | Not installed |

### Where tracking is initialized in source

```
src/layouts/Layout.astro:363-377   GTM-PKSH2C5K head script + noscript iframe (only direct third-party tracker)
src/layouts/Layout.astro:399-401   Vercel Analytics inject()
src/layouts/Layout.astro:403-406   Vercel Speed Insights injectSpeedInsights()
src/lib/track.ts:5,18-35           Central dual-tracking helper (dataLayer + Vercel)
src/components/shared/Preload.astro:18-19  Preconnect hints to connect.facebook.net + analytics.tiktok.com (no scripts loaded)
```

### Tracking IDs found anywhere

```
GTM-PKSH2C5K               — hardcoded, Layout.astro
PUBLIC_TACTFUL_PROFILE_ID  — 954 (chat widget, currently disabled)
PUBLIC_TACTFUL_TOKEN       — 8f279b5c... (chat widget; ⚠️ leaked in .env.example committed to repo)
```

**No GA4, no Meta Pixel, no Google Ads, no TikTok Pixel IDs exist anywhere in the codebase or environment files.** The user must source these IDs from their respective ad platforms before any direct-implementation fix can be applied.

---

## Event Firing Matrix

Legend: ✅ confirmed firing in code path · ⚠️ depends on GTM container config (unverified) · ❌ not firing · ➖ not applicable

| Event | Code Location | Vercel Analytics | dataLayer push | GA4 (via GTM) | Meta Pixel (via GTM) | Google Ads (via GTM) |
|---|---|:---:|:---:|:---:|:---:|:---:|
| Page view | Layout.astro auto via `inject()` and GTM `gtm.js` event | ✅ auto | ✅ auto (`gtm.js`) | ⚠️ | ⚠️ | ⚠️ |
| `hero_cta_click` (primary "Protect Your Car Today") | ModernHeroCarousel.astro:271-285 | ✅ | ❌ **no dataLayer push** | ❌ | ❌ | ❌ |
| `secondary_cta_click` (secondary "See Our Work") | ModernHeroCarousel.astro:289-303 | ✅ | ❌ **no dataLayer push** | ❌ | ❌ | ❌ |
| `whatsapp_hero_click` (event name to Vercel) / `whatsapp_click` (event name to dataLayer) | ModernHeroCarousel.astro:235-267 | ✅ | ✅ but as `whatsapp_click` (different name from Vercel) | ⚠️ | ⚠️ | ⚠️ |
| `whatsapp_float_click` (Vercel) / `whatsapp_click` (dataLayer) | WhatsAppFloat.astro:54-88 | ✅ | ✅ but as `whatsapp_click` (different name) | ⚠️ | ⚠️ | ⚠️ |
| `whatsapp_click` (action pills inline) | not found in ActionPills.tsx — no WhatsApp button there | ❌ | ❌ | ❌ | ❌ | ❌ |
| `call_navbar_click` | ActionPills.tsx:91-101 | ✅ | ❌ **no dataLayer push — GA4/Meta/Ads cannot see this** | ❌ | ❌ | ❌ |
| `whatsapp_branch_click` (docs) / `whatsapp_click` (actual) | StaticBranchCards.tsx:118-139 | ❌ | ✅ as `whatsapp_click` | ⚠️ | ⚠️ | ⚠️ |
| Branch card phone click | StaticBranchCards.tsx:88-91 | ❌ — `trackTikTok` no-op only | ❌ | ❌ | ❌ | ❌ |
| Footer phone (`tel:` link) | Footer.astro — no onClick wired | ❌ | ❌ | ❌ | ❌ | ❌ |
| Footer WhatsApp / social links | Footer.astro — no tracking | ❌ | ❌ | ❌ | ❌ | ❌ |
| `form_submit` (client-side, on success) | ContactForm.astro:729-731 | ❌ — only direct `fbq`/`gtag`/`ttq` fallbacks (silently no-op since none of those globals are loaded) | ❌ | ❌ | ❌ | ❌ |
| `form_submit` (server-side) | api/contact.ts:140-148 | ✅ server-side `track()` | ➖ | ❌ (server can't push to dataLayer) | ❌ | ❌ |
| `business_contact_submit` (server-side) | api/business-contact.ts:141-145 | ✅ | ➖ | ❌ | ❌ | ❌ |
| `contact_wizard_step_view` / `step_next` / `service_toggle` | ContactWizard.tsx via `src/lib/track.ts` | ✅ | ✅ (uses central helper) | ⚠️ | ⚠️ | ⚠️ |

### Concrete examples of inconsistent event names

- Vercel sees `whatsapp_hero_click`. dataLayer (and therefore GTM/GA4) sees the same physical click as `whatsapp_click` with `location: 'hero'`. A GTM trigger built for `whatsapp_hero_click` would fail silently.
- Vercel sees `whatsapp_float_click`. dataLayer sees `whatsapp_click` with `location: 'floating_button'`.
- Vercel sees `whatsapp_branch_click` (per docs) but the actual code pushes `whatsapp_click` with `location: 'branch_card'`.

This means GA4/Meta Pixel triggers in GTM that key off `whatsapp_hero_click`, `whatsapp_float_click`, etc. would never fire — only a generic `whatsapp_click` trigger would catch them, with `location` as a parameter.

---

## Live Deployment Check (curl evidence)

| URL | HTTP body size | GTM script (`GTM-PKSH2C5K`) | `fbq(`/`fbevents.js` | `gtag(`/`gtag/js` | `AW-` | `G-XXXXX` | Vercel Analytics |
|---|---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `/` | 182,882 B | 3 occurrences ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |
| `/contact` | 102,118 B | 3 ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |
| `/ar` | 183,947 B | 3 ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |
| `/ar/contact` | 98,626 B | 3 ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |
| `/gallery` | 270,056 B | 3 ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |
| `/services` | 112,982 B | 3 ✅ | 0 ❌ | 0 ❌ | 0 ❌ | none ❌ | bundled module ✅ |

(Vercel Analytics is invisible to a substring grep because Astro bundles `import('@vercel/analytics')` into a hashed module like `/_astro/Layout.astro_astro_type_script_index_0_lang.7Gweabuk.js`. Confirmed loaded via the script-src grep.)

**Conclusion from network-level evidence:** the only third-party advertising tracker the page loads on its own is GTM. Everything else (GA4, Meta, Ads, TikTok) has to be injected by GTM-managed tags at runtime.

---

## Configuration Verification

- `.env.example` contains: `RESEND_API_KEY`, `EMAIL_FROM`, `LEADS_EMAIL`, `ADMIN_EMAIL`, `PUBLIC_TACTFUL_PROFILE_ID`, `PUBLIC_TACTFUL_TOKEN`. **No tracking IDs.**
- No `.env`, `.env.local`, or `.env.production` files present locally.
- `vercel.json` contains caching headers and security headers only — no tracking config.
- `astro.config.mjs` has `terserOptions.compress.drop_console = true` — `console.log` calls are stripped from prod, including the `console.error` calls in tracking error handlers (so tracking failures are completely silent in prod).
- ⚠️ **Security note (out of audit scope but worth flagging):** `.env.example` has a real-looking `RESEND_API_KEY=re_DXwbqBBV_...` value committed to the repo. Resend API keys are sensitive. Recommend rotating it and replacing with a placeholder. Same concern for the Tactful token committed there.

---

## Network-level verification (headless browser)

Not run — Playwright is in `devDependencies` but actual click-and-capture verification was deferred to keep Phase 1 read-only and within reasonable time. The static curl evidence above is sufficient to identify the root causes; live network capture would only be needed to validate fixes in Phase 3.

---

## Root Causes Identified

### 1. Google Ads zero-conversion (highest impact — direct cost on 21,060 EGP spend)

The site has **no `AW-XXXXXXXXX` Google Ads global tag and no `gtag('event', 'conversion', ...)` calls anywhere**. Google Ads conversion tracking depends on one of two paths, neither of which is verifiable from the codebase alone:

- **Path A:** The GTM container `GTM-PKSH2C5K` has a "Google Ads Conversion Tracking" tag with the right `conversion_id` and `conversion_label`, triggered by the right event. Given Google Ads currently shows zero, this tag is either **missing**, **firing on the wrong trigger**, or the trigger event names mismatch what the site actually pushes (recall: the site pushes `whatsapp_click`, not `whatsapp_hero_click` etc.).
- **Path B:** GA4 events are imported into Google Ads as "GA4 conversion actions" via the Google Ads UI (Tools → Conversions → New → Import → GA4). If this hasn't been done, even working GA4 events won't drive Google Ads attribution.

Without GTM container access we cannot tell A vs B from the repo. **Both fixes are doable from the codebase by ignoring GTM and writing the gtag conversion tag directly into `Layout.astro`** — this removes the GTM dependency entirely for Google Ads.

### 2. Meta Pixel partial / inconsistent

Same shape of problem: no `fbq('init', PIXEL_ID)` exists anywhere in the repo. The pixel only loads if GTM has a Meta Pixel tag inside it. The single direct call site (`ContactForm.astro:729`) is wrapped in `typeof window.fbq !== 'undefined'` so it silently no-ops when fbq isn't loaded.

Even if a Meta Pixel tag exists in GTM, the trigger names are likely mismatched: the site code pushes `whatsapp_click`, `hero_cta_click`, etc., but `hero_cta_click` and `secondary_cta_click` don't push to `dataLayer` at all (Vercel Analytics only — see `ModernHeroCarousel.astro:271-303`), so a Meta Pixel custom-event tag in GTM keyed off those events is firing 0 times.

### 3. Inconsistent tracking implementation (dataLayer vs Vercel divergence)

`src/lib/track.ts` is the central dual-tracker, but **multiple components reimplement the dual-track logic inline with different event names per layer**:

| Component | Vercel event name | dataLayer event name |
|---|---|---|
| WhatsAppFloat.astro:57,73 | `whatsapp_float_click` | `whatsapp_click` |
| ModernHeroCarousel.astro:238,253 | `whatsapp_hero_click` | `whatsapp_click` |
| ModernHeroCarousel.astro:276 | `hero_cta_click` | **(missing — no dataLayer push)** |
| ModernHeroCarousel.astro:294 | `secondary_cta_click` | **(missing — no dataLayer push)** |
| ActionPills.tsx:92 | `call_navbar_click` | **(missing — no dataLayer push)** |
| StaticBranchCards.tsx:127 | (none — only no-op TikTok) | `whatsapp_click` |

This means any GTM trigger built off Vercel-style names (`whatsapp_hero_click`, `whatsapp_float_click`, `hero_cta_click`, `secondary_cta_click`, `call_navbar_click`) will never fire. Only a generic `whatsapp_click` trigger works in GTM today.

### 4. Server-side `form_submit` is invisible to ad pixels

`api/contact.ts:140-148` uses `@vercel/analytics/server` to track `form_submit`, but this is server-only — it cannot push to the browser's `dataLayer`, cannot run `fbq`, cannot run `gtag`. The client-side fallback `fbq('track','Lead',...)` and `gtag('event','form_submit',...)` in `ContactForm.astro:729-730` is the only browser-side hook, and both globals are never loaded directly. So **form submissions never reach Meta Pixel as a `Lead` event and never reach Google Ads as a conversion** unless GTM is configured to fire those tags off some other observable signal (form post-back URL, etc.) — unlikely.

### 5. Several CTA paths have no tracking at all

- Footer `tel:` link — no `onClick`, no tracking. Docs claimed `call_footer_click` exists; it doesn't.
- Footer social media + WhatsApp links — no tracking. Docs claimed `whatsapp_footer_click` exists; it doesn't.
- Branch-card phone numbers — only a no-op `trackTikTok` stub (StaticBranchCards.tsx:88-91). Phone clicks from Contact page branch list are completely unmeasured.

### 6. RegionSelector intercept (recent commits) — verified NOT a tracking blocker

The `RegionSelector.astro` capture-phase click listener (line 330-361) calls `e.preventDefault()` but does **not** call `e.stopPropagation()`. Click events still propagate to bubble-phase listeners, so the existing tracking handlers on `#hero-whatsapp-cta`, `.whatsapp-float-btn`, `[data-sk-region-picker]` still fire normally before the modal opens. Tracking is preserved. (Worth a manual verification in Phase 3 with DevTools, but the code is correct in principle.)

### 7. Console errors stripped in prod

`astro.config.mjs:74-79` removes `console.log/info/debug` from production builds. The tracking error handlers throughout the codebase use `console.error('Vercel Analytics tracking error:', error)` — `console.error` is **not** in the strip list, so genuine errors do surface. Good.

---

## Recommended Fix Plan

Each fix can be applied independently. They're listed in impact order.

### FIX A — Direct Google Ads conversion tracking (highest $ impact)

**What:** Add `gtag.js` global tag to `Layout.astro` head with the Google Ads conversion ID `AW-XXXXXXXXX` (user must provide). Then trigger `gtag('event', 'conversion', { send_to: 'AW-XXXXXXXXX/CONVERSION_LABEL' })` from inside `src/lib/track.ts` for the conversion-worthy events: WhatsApp clicks (any) → `whatsapp_lead` conversion; form submit → `form_lead` conversion.

**Why direct, not GTM:** removes a layer of opaque config. We control which events fire conversion in source-controlled code. GA4 can stay in GTM untouched.

**Files affected:** `src/layouts/Layout.astro` (add gtag base + AW config), `src/lib/track.ts` (add gtag conversion call inside the central `track()` function for whitelisted event names), `.env.example` (add `PUBLIC_GOOGLE_ADS_ID` and `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_*` placeholders).

**Effort:** ~30 min.

**Need from user:** Google Ads conversion ID (`AW-...`) and one or two conversion labels (one for WhatsApp lead, one for form lead). These are obtained from Google Ads → Tools → Conversions → New conversion → Tag setup.

### FIX B — Direct Meta Pixel base code + standard event mapping

**What:** Add Meta Pixel base code to `Layout.astro` head (`fbq('init', PIXEL_ID); fbq('track','PageView');`) and add `fbq` calls inside `src/lib/track.ts` for the central event-to-standard-event map:
- `whatsapp_*_click` → `fbq('track', 'Contact')`
- `form_submit` (client) → `fbq('track', 'Lead')`
- `hero_cta_click` → `fbq('trackCustom', 'HeroCTAClick')`

Server-side `form_submit` (api/contact.ts) cannot reach `fbq` directly; we either need to push the lead via Meta's Conversions API (CAPI) from the server with `RESEND_API_KEY`-style env config, or trigger the client-side fbq Lead **before** posting to `/api/contact` (or in the success branch of ContactForm.astro:729 — already in place but waiting for `fbq` to exist).

**Files affected:** `src/layouts/Layout.astro`, `src/lib/track.ts`, `.env.example` (add `PUBLIC_META_PIXEL_ID`).

**Effort:** ~45 min for client-side. Add ~2 hours if implementing Meta CAPI server-side for form_submit (requires Meta access token + dataset ID).

**Need from user:** Meta Pixel ID (15- or 16-digit number from Meta Events Manager).

### FIX C — Converge all event firing through `src/lib/track.ts`

**What:** Refactor `WhatsAppFloat.astro`, `ModernHeroCarousel.astro`, `StaticBranchCards.tsx`, `ActionPills.tsx` to import their respective tracker functions from `src/lib/track.ts` instead of inlining `dataLayer.push` + `vercelTrack`. Use one canonical event name per click — push the same name to both Vercel AND dataLayer (no more `whatsapp_hero_click` to Vercel + `whatsapp_click` to dataLayer divergence).

**Why:** makes GTM trigger configuration sane (one event name per physical action), fixes `hero_cta_click` / `secondary_cta_click` / `call_navbar_click` being invisible to GTM-managed pixels, and removes drift between docs and code.

**Files affected:** the four components above; `src/lib/track.ts` (already has the right exports, no changes needed).

**Effort:** ~1 hour. Low risk because `track.ts` already does both fan-outs.

### FIX D — Add tracking to footer & branch-card phone

**What:** Wire `onClick`/`addEventListener` to `Footer.astro` `tel:` link and social/WhatsApp links calling `trackCallFooter` / `trackWhatsAppFooter`. Replace the `trackTikTok` no-op in StaticBranchCards.tsx phone handler with `trackCallBranch`.

**Files affected:** `src/components/layout/Footer.astro`, `src/components/contact/StaticBranchCards.tsx`.

**Effort:** ~30 min.

### FIX E — Server-side form-submit dual write to client pixels

**What:** When `/api/contact` returns ok, the existing `ContactForm.astro:729-730` fires `fbq('track','Lead')` and `gtag('event','form_submit')`. Once Fixes A and B are in, these fire correctly. Optionally add `gtag('event','conversion',{send_to:AW-.../FORM_LABEL})` here too for redundancy.

**Effort:** ~10 min after A+B.

### FIX F (cleanup, optional) — Remove dead Tactful & TikTok scaffolding

`TactfulWidget.astro` is a 122-line file that's entirely an HTML comment. `trackTikTok` no-op functions are duplicated across files. If TikTok will be re-enabled, restore real calls and clean stubs. If not, delete dead code for clarity.

---

## Open Questions for Approval

1. **Should we keep GTM at all?** Recommendation: **keep GTM** but stop relying on it for paid-media tags. Move Meta Pixel and Google Ads to direct gtag/fbq in `Layout.astro` (Fixes A + B). Leave GA4 in GTM since it's already working and out of the failure mode. Reasoning: (a) GTM is invisible to source review, which is exactly why this audit had to stop here, (b) direct paid-media tags cost zero performance vs GTM-managed, (c) GA4 isn't broken so don't touch it. Alternative: remove GTM entirely and add direct GA4 too — bigger change, more risk, no clear win unless the user wants GTM gone for governance reasons.

2. **What are the missing IDs?** Need the user to provide:
   - Google Ads conversion ID (`AW-XXXXXXXXX`)
   - Up to two Google Ads conversion labels (one for WhatsApp lead, one for form lead) — or confirm one shared label is fine
   - Meta Pixel ID (15-16 digits)
   - (Optional) Meta CAPI access token + dataset ID if we want server-side form_submit → Meta

3. **Event-name canonicalization — break or keep?** Fix C will rename the dataLayer events to match the Vercel names (e.g., dataLayer will see `whatsapp_hero_click`, not `whatsapp_click` with `location: 'hero'`). Any GTM tag currently triggering on the generic `whatsapp_click` event will need its trigger updated. **Confirm: are there existing live GTM tags keying off `whatsapp_click` that we'd break?** If yes, we should keep both names (push `whatsapp_click` AND `whatsapp_hero_click` to dataLayer for one release, then deprecate the generic).

4. **Where do these conversion goals live?** User said: "whatsapp_lead (any WhatsApp click), form_lead (form submit)". Confirming: a single `whatsapp_lead` conversion fires on **any** of `whatsapp_hero_click` | `whatsapp_float_click` | `whatsapp_branch_click` (deduped how? per-session? per-click?). Recommend per-click counting in Google Ads (it'll naturally dedupe at the campaign-attribution layer).

5. **Rotate the leaked Resend API key in `.env.example`?** This is out of scope for tracking but is a real production-data-exfiltration risk. Recommend rotating before any further commits to that file.

6. **Do you want a Phase 1.6 follow-up with Playwright?** I can do a headless click-and-capture run (load `/`, click Hero WhatsApp + Float WhatsApp + form submit, capture `network` for `googletagmanager.com`, `facebook.com/tr/`, `googleadservices.com`, `google-analytics.com/g/collect` requests) — useful as a *before* baseline so we can prove fixes worked. ~20 min.

---

## Appendix — Source files inventoried

**Tracking code call-sites (full list):**
```
src/layouts/Layout.astro:363-377            GTM container init
src/layouts/Layout.astro:399-401            Vercel Analytics inject
src/lib/track.ts (whole file)               Central dual-tracker; 18 exported event helpers
src/components/WhatsAppFloat.astro:42,57-88 WhatsApp float (Vercel + dataLayer, inline)
src/components/hero/ModernHeroCarousel.astro:224-305 Hero CTAs (Vercel only for primary/secondary; Vercel+dataLayer for whatsapp)
src/components/layout/ActionPills.tsx:3,86-102 Navbar call (Vercel only)
src/components/contact/ContactWizard.tsx:7  Wizard events (uses central track.ts)
src/components/contact/StaticBranchCards.tsx:88-91,118-139 Branch cards (no-op TikTok + dataLayer for whatsapp)
src/components/ContactForm.astro:729-731    Direct fbq/gtag/ttq fallback (silently no-ops)
src/pages/api/contact.ts:4,140-148          Server-side form_submit
src/pages/api/business-contact.ts:4,141-145 Server-side business_contact_submit
src/components/shared/Preload.astro:18-19   Preconnect hints (no scripts loaded)
```

**Documentation files reviewed:**
```
TRACKING_SUMMARY.md           — describes intended dual-tracking model (mostly matches code, but documents events that aren't actually fired: whatsapp_footer_click, call_footer_click, call_branch_click)
VERCEL_ANALYTICS_TRACKING.md  — same caveat as above
```

**Config files reviewed:**
```
.env.example         — no tracking IDs
astro.config.mjs     — no tracking integration; drops console.log in prod
vercel.json          — no tracking config
package.json         — @vercel/analytics + @vercel/speed-insights only
```

---

**Phase 1 complete. Awaiting your approval to proceed to Phase 2 (fix plan selection) and Phase 3 (apply fixes). No code has been modified.**

---

## Changes Applied

### Fix A — Direct Google Ads conversion tracking (applied 2026-05-07)

Approved scope: install `gtag.js` with `AW-17767525580` and fire `event=conversion` for WhatsApp / Call / Form lead actions, env-driven, graceful degradation when env vars are unset.

**Files modified:**

1. **`src/lib/googleAdsConversion.ts`** *(new)* — small helper exporting `fireGoogleAdsConversion(kind: 'whatsapp' | 'call' | 'form')`. Reads IDs/labels from `import.meta.env.PUBLIC_*` at build time. Silently no-ops when ID/label missing or `window.gtag` not yet loaded.

2. **`src/layouts/Layout.astro`** — added `const googleAdsId = import.meta.env.PUBLIC_GOOGLE_ADS_ID;` to frontmatter; emits the standard Google `gtag.js` async loader + inline init (`gtag('js', ...)` + `gtag('config', AW-...)`) inside a `{googleAdsId && (...)}` Fragment, placed in `<head>` immediately before the existing GTM block. Inline script uses `is:inline` + `define:vars` so the AW-ID is server-injected and `gtag` becomes a true global (`window.gtag = gtag`). When `PUBLIC_GOOGLE_ADS_ID` is unset, the entire block renders nothing — verified by curling dev server with env vars unset (0 occurrences of `gtag/js` / `AW-`, GTM unaffected).

3. **`src/lib/track.ts`** — central `track()` function now accepts an optional 3rd `adsConversion: AdsConversionKind` argument; `trackFormSubmit` / `trackLeadSubmit` / `trackBusinessContactSubmit` now also fire `'form'` conversion; all `trackWhatsApp*` helpers fire `'whatsapp'`; all `trackCall*` helpers fire `'call'`. Existing dataLayer + Vercel Analytics behavior preserved unchanged.

4. **`src/components/WhatsAppFloat.astro`** — added `import { fireGoogleAdsConversion }` + `fireGoogleAdsConversion('whatsapp')` call alongside the existing Vercel Analytics + dataLayer push in the click handler. **Live**: this script runs on every page (it's the floating WhatsApp button).

5. **`src/components/hero/ModernHeroCarousel.astro`** — same pattern: added `fireGoogleAdsConversion('whatsapp')` to the `#hero-whatsapp-cta` click handler. Primary CTA (`/contact` link) and secondary CTA (`/gallery` link) intentionally NOT wired to conversions — they're navigation, not lead intent. **Live** on every page that uses the modern hero (homepage `/` and `/ar`).

6. **`src/components/layout/ActionPills.tsx`** — added `fireGoogleAdsConversion('call')` to the navbar `tel:` button onClick. **Live**: ActionPills is rendered with `client:idle` from `Nav.astro` so it hydrates on every page.

7. **`src/components/contact/StaticBranchCards.tsx`** — added `fireGoogleAdsConversion('whatsapp')` to the per-branch WhatsApp button onClick. **⚠ Dormant in production today**: this component is rendered in `src/pages/contact.astro:101` and `src/pages/ar/contact.astro` *without* a `client:*` directive, so it server-renders only and its onClick handlers are never hydrated. This is a pre-existing condition (the existing TikTok/dataLayer code in the same handler is dormant for the same reason). My added line is consistent with that pattern — harmless, will activate automatically the day someone adds `client:idle` to those usages. Recommend treating "wire up branch-card click hydration" as a separate follow-up.

8. **`src/components/ContactForm.astro`** — imported helper at top of `<script>`; added `fireGoogleAdsConversion('form')` immediately after the existing fbq/gtag/ttq fallbacks in the form-submit success path. **Live** on `/contact` and `/ar/contact`.

9. **`.env.example`** — added placeholder lines `PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX` plus the three label placeholders, with a comment block explaining: real values go in `.env.local` (gitignored) for local dev and into Vercel Project Environment Variables for Production + Preview. No real values committed.

### Verification performed locally

- `astro build` (with the four real env values exported in shell) — **PASS**, no errors. Bundle output confirms `dist/client/_astro/googleAdsConversion.qoh9V_y7.js` (320 B) is created and contains the `AW-17767525580` ID + all three labels baked in. Each consumer bundle (`WhatsAppFloat`, `ModernHeroCarousel`, `ActionPills`, `ContactForm`) imports `googleAdsConversion.qoh9V_y7.js` and contains its respective kind literal (`"whatsapp"` / `"call"` / `"form"`).
- `astro dev` with env set — homepage HTML emits `<script async src="https://www.googletagmanager.com/gtag/js?id=AW-17767525580"></script>` followed by the inline `gtag('config', "AW-17767525580")` call, BEFORE the GTM container loader. `window.gtag = gtag` confirmed in rendered output. GTM still loads normally.
- `astro dev` with env unset — 0 occurrences of `gtag/js` or `AW-` in served HTML. GTM still loads (3 occurrences as before). Graceful degradation works.

### Known limitations / not done in this fix

- **Server-side `form_submit` from `api/contact.ts:140-148`** still tracks via Vercel Analytics only — server runtime cannot call `gtag`. The browser-side conversion fires from `ContactForm.astro` on success, which covers normal user flow. (Server-side path would need Google Ads CAPI/Enhanced Conversions, out of scope for Fix A.)
- **Branch-card WhatsApp click is dormant** because `<StaticBranchCards>` lacks a `client:*` directive (see #7 above). Pre-existing condition; not a regression.
- **GTM container is untouched.** Fix A intentionally bypasses GTM for Google Ads. GA4 (still working through GTM) is unaffected.

### What the user must do to make Fix A live in production

1. **Add real env values to Vercel** (Production + Preview environments):
   - `PUBLIC_GOOGLE_ADS_ID=AW-17767525580`
   - `PUBLIC_GOOGLE_ADS_LABEL_WHATSAPP=5GGvCJf94KgcEMzZm5hC`
   - `PUBLIC_GOOGLE_ADS_LABEL_CALL=Y7f2CJr94KgcEMzZm5hC`
   - `PUBLIC_GOOGLE_ADS_LABEL_FORM=a3PYCJ394KgcEMzZm5hC`
2. **Add the same to local `.env.local`** for dev testing (gitignored — won't leak).
3. **Deploy via Vercel preview first**, not direct to main. Verify on preview URL by:
   - Opening preview in Chrome with DevTools Network tab filtered to `googleadservices.com` or `googleads.g.doubleclick.net`
   - Clicking floating WhatsApp button → confirm a request fires
   - Clicking hero WhatsApp → confirm a request fires
   - Clicking navbar phone icon → confirm a request fires
   - Submitting contact form → confirm a request fires on success
   - Optional: install Google's "Tag Assistant" Chrome extension and verify the conversion events appear with the right send_to values
4. **Promote to Production** once preview verifies clean.
5. **Watch Google Ads → Tools → Conversions** for "Recording conversions" status (should switch from "No recent conversions" to active within 1–24 h of first real click).

### Recommended next steps (not yet approved)

- **Fix B (Meta Pixel)** — same shape: needs Pixel ID, then add base + standard event mapping in `Layout.astro` and `track.ts`. Would close the "Meta Pixel partial" gap.
- **Fix C (event-name convergence)** — would let a future `Add to GTM trigger` work consistently; low priority now that paid-media doesn't depend on GTM for Ads.
- **Hydrate `<StaticBranchCards>`** — one-line change (`client:idle`) in `contact.astro` lines so branch-card WhatsApp clicks fire conversions and dataLayer events. Out of Fix A scope.
