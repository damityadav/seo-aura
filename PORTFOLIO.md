# SEO Aura — Portfolio Entry

Copy-paste–ready content for your portfolio website. Use as much or as little as you like.

---

## 1. Project Title
**SEO Aura — SEO Audit & Tracker Detector**
*Chrome Extension (Manifest V3)*

## 2. Tagline (one-liner)
> A privacy-first Chrome extension that audits any webpage's SEO, exposes hidden tracking pixels, and benchmarks performance — all locally, in one click.

## 3. Elevator Pitch (2–3 lines)
SEO Aura is a polished Chrome extension for developers, SEO specialists, and web designers. It runs a full on-page SEO audit, detects active marketing/tracking scripts, extracts copy-protected text, bulk-downloads images as a ZIP, and pulls Google PageSpeed Insights — without sending any page data off the user's device.

## 4. Overview (long description)
SEO Aura turns any browser tab into an instant SEO command center. One click runs a real-time sweep of the page and surfaces a 0–100 SEO score on a glowing radial chart, broken down into Critical Errors, Warnings, and Passed checks with exact metrics and fix suggestions. Beyond SEO, it reveals which third-party trackers a site is running, lets users grab clean text from copy-protected pages, packages every image on a page into a single local ZIP, and runs Core Web Vitals diagnostics via Google PageSpeed Insights. The entire architecture is local-first: no servers, no analytics, no data collection.

## 5. Key Features
- **Instant SEO Audit** — title, meta description, H1–H4 heading hierarchy, canonical tags, robots directives, image alt text, link validity, word count, and Open Graph / Twitter card checks.
- **0–100 Score** — overall SEO health on an animated, color-coded radial gauge (green / amber / rose).
- **Tracker & Pixel Detector** — finds Meta/Facebook, TikTok, X/Twitter, LinkedIn, Google Analytics, Microsoft Clarity, Hotjar, HubSpot, Stripe and more.
- **Protected Content Copier** — bypasses `user-select:none`, copy interceptors, and context-menu blocks to extract clean text.
- **Images ZIP Downloader** — gallery of all page images with one-click bulk download, zipped locally in the browser.
- **Google PageSpeed Insights** — mobile/desktop performance, Core Web Vitals (FCP, LCP, CLS, TBT), and optimization tips.
- **Privacy-first** — runs only on demand, 100% local processing, zero data transmission.

## 6. Tech Stack
- **Chrome Extension** — Manifest V3, service-worker-free, on-demand scripting
- **JavaScript (vanilla)** — content scripts + popup logic, no framework overhead
- **HTML5 / CSS3** — custom glassmorphic "Aura Luminescence" design system (CSS variables, backdrop-blur, SVG radial charts)
- **Chrome APIs** — `scripting`, `storage`, `tabs`, `downloads`, `activeTab`
- **Google PageSpeed Insights API** — client-side performance diagnostics
- **Client-side ZIP generation** — zero-dependency, in-browser image archiving

## 7. My Role / What I Built
Designed and built the entire extension end-to-end — UX/UI design system, the SEO analysis engine, the tracker-detection parser, the copy-protection bypass, the local ZIP compiler, and the PageSpeed integration. Also handled the privacy policy and Chrome Web Store submission.

## 8. Technical Highlights (good talking points)
- Built a **local-first architecture** — all auditing runs inside the tab context with no backend, preserving user privacy.
- Engineered a **copy-protection bypass** that reads DOM text programmatically in an isolated environment.
- Implemented **in-browser ZIP packaging** of image assets with no external libraries/CDN (MV3 CSP-safe).
- Designed a custom **glassmorphic design system** (electric-blue/emerald/amber on deep navy) with animated SVG score rings.
- Integrated the **Google PageSpeed API** with graceful keyless fallback and optional user API-key support.

## 9. Screenshots
Located in `screenshots/` (use these on the portfolio):
- `screenshot-1.png` — SEO audit + score
- `screenshot-2.png` — Trackers detected
- `screenshot-3.png` — Copy / Images
- `screenshot-4.png` — PageSpeed Insights
- `screenshot-5.png` — Schema / extras

## 10. Links
- **Chrome Web Store:** _add link once the extension is approved & live_
- **Live demo / privacy page:** https://github.com/damityadav/seo-aura-privacy
- *(Note: the main source repo is private — link the Chrome Web Store listing as the primary CTA.)*

---

### Suggested portfolio card layout
> **SEO Aura** · Chrome Extension
> *Privacy-first SEO audit, tracker detection & PageSpeed analysis — one click, fully local.*
> `Manifest V3` `Vanilla JS` `CSS Glassmorphism` `Chrome APIs` `PageSpeed API`
> [ View on Chrome Web Store → ]  · screenshots
