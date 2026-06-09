# Chrome Web Store Listing — SEO Aura - Audit & Tracker Detector

> Last Updated: 2026-06-09

## Store Listing

**Extension Name**
SEO Aura - Audit & Tracker Detector

**Short Description**
Analyze page SEO hierarchy, headings, word counts, and instantly detect active tracking pixels & marketing scripts.

**Detailed Description**
SEO Aura is a beautiful, professional, and privacy-respecting Chrome extension built for developers, SEO specialists, and web designers. Audit any website's SEO health, instantly uncover active third-party tracking scripts, bypass right-click selections to extract clean content, download full website media elements packaged into a single unified ZIP archive, and analyze performance diagnostics using Google PageSpeed Insights.

**Key Features:**
- **Instant SEO Audit**: Evaluates page title, meta description, heading structure hierarchy (H1, H2, H3, H4), canonical tags, robots directives, image alt attributes, anchor links validity, word counts, and social sharing Open Graph / Twitter cards.
- **Detailed Actionable Insights**: Checkpoints are organized into Critical Errors, Warnings, and Passed Audits, complete with exact page metrics and optimization suggestions.
- **Active Tracker & Pixel Detector**: Scans and parses script elements and loaded network assets to discover Facebook Pixels, TikTok Pixels, Twitter/X Pixels, LinkedIn Insight Tags, Google Analytics, Microsoft Clarity, Hotjar, HubSpot, Stripe, and other utility scripts.
- **Protected Content Copier**: Bypasses page selection protections (user-select: none, oncopy interceptors, and context-menu blockages). SEO Aura reads DOM text elements programmatically in an isolated environment and processes clipboard copying safely from inside the popup window.
- **Images ZIP Downloader**: Gathers all visible image assets, displays them in a gorgeous 2-column gallery, and allows single-click downloads or a one-click package download of all images bundled into a single ZIP archive compiled locally in the browser.
- **Google PageSpeed Insights**: Audit mobile and desktop loading speed, view Core Web Vitals (FCP, LCP, CLS, TBT, Speed Index, Time to Interactive), and receive actionable optimization suggestions with dynamic API Key support.
- **Visual Score Indicator**: Calculates an overall page SEO score out of 100 on a gorgeous, glowing radial chart.
- **On-Demand Performance**: The extension script only executes when you click the popup. No background processor load, no battery drain, and absolute browsing privacy.

**How to Use:**
1. Navigate to any webpage you want to inspect or download from.
2. Click the SEO Aura icon in your browser toolbar.
3. The popup will automatically perform a real-time sweep of the page.
4. Toggle between the "SEO", "Trackers", "Copy Text", "Images", and "PageSpeed" tabs to explore detailed cards and accordions.
5. Click on any tracker card to see its exact detection source.
6. Click "Copy Content" to grab formatted page text instantly, even on copy-protected sites.
7. Click "Download All" on the Images tab to bundle and download all page images in a single, local compiled ZIP file.
8. Navigate to the PageSpeed tab, select your Device Strategy (Mobile/Desktop), configure your API key if needed, and click 'Analyze Speed' to inspect site loading times.

**Privacy & Local Audit:**
All analysis is executed entirely locally inside your browser tab. We do not track your search history, compile profiles, or transmit any web content off-device.

**Category**
Developer Tools

**Single Purpose**
Audits webpage SEO architecture, copies protected text, and downloads visible images as a ZIP.

**Primary Language**
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|-------|-----------|--------|----------|
| Store Icon | 128×128 PNG | ✅ Ready | icons/icon-128.png |
| Screenshot 1 | 1280×800 | ✅ Ready | screenshots/screenshot-1.png |
| Screenshot 2 | 1280×800 | ✅ Ready | screenshots/screenshot-2.png |
| Screenshot 3 | 1280×800 | ✅ Ready | screenshots/screenshot-3.png |
| Screenshot 4 | 1280×800 | ✅ Ready | screenshots/screenshot-4.png |
| Screenshot 5 | 1280×800 | ✅ Ready | screenshots/screenshot-5.png |
| Small Promo Tile | 440×280 | ⬜ Not created | promo/promo-small.png |

### Screenshot Notes
- **Screenshot 1**: The main SEO Audit tab, displaying a high-score glowing ring, open accordion check details, and showing optimization tips.
- **Screenshot 2**: The Active Trackers tab showing multiple detected marketing, social pixel, and analytics cards with expanded detection details.
- **Screenshot 3**: The Copy Text tab showing formatted, extracted text bypass page selection rules, showing the "Copy Content" badge in action.
- **Screenshot 4**: The Images gallery tab showing a gorgeous grid of image cards with download actions.
- **Screenshot 5**: The Google PageSpeed Insights tab showing overall Mobile/Desktop speed score, diagnostic metrics, and recommendations card.

---

## Permissions Justification

Every permission configured inside `manifest.json` is scoped to minimal user actions to respect CWS security requirements.

| Permission | Type | Justification |
|------------|------|---------------|
| `activeTab` | permissions | Required to fetch details from the currently active browser tab when the user clicks the extension action icon. It grants temporary access without reading web history across other tabs. |
| `scripting` | permissions | Required to execute the local analysis script (`content/analyzer.js`) inside the active tab context to read HTML tags, script elements, and performance metrics. |
| `storage` | permissions | Required to save user popup session state and theme/filter preferences locally. |
| `tabs` | permissions | Required to safely read the URL and title of the active tab, avoiding undefined responses across multiple browser environments. |
| `downloads` | permissions | Required to programmatically save web image assets directly to the user's downloads folder upon their explicit click on "Download" buttons. |
| `<all_urls>` | host_permissions | Required to programmatically fetch cross-origin binary data of external images, allowing local image compilation and bundling into a unified ZIP archive without CORS blocks. |

---

## Privacy & Data Use

### Data Collection

**Does the extension collect user data?** No

All calculations and scripts execution are restricted to the local device. No data is collected, stored, or transmitted off-device.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Privacy Policy

**Privacy Policy URL**
https://github.com/damityadav/seo-aura/blob/main/PRIVACY.md

---

## Distribution

**Visibility**: Public
**Regions**: All regions
**Pricing**: Free

---

## Developer Info

**Publisher Name**
Amit Yadav

**Contact Email**
damityadavdigital@gmail.com

**Homepage URL**
https://github.com/damityadav/seo-aura

---

## Version History

| Version | Date | Changes | Status |
|---------|------|---------|--------|
| 1.2.0 | 2026-06-09 | Removed Rank Tracker. Refactored PageSpeed Insights integration: fixed layout issues, added optimization opportunities, and integrated customizable API Key configuration with local storage. | Draft |
| 1.1.0 | 2026-06-01 | Added Content Copy tab (with anti-copy bypass safeguards) and Images Downloader tab with local, zero-dependency ZIP archive compiler. | Draft |
| 1.0.0 | 2026-06-01 | Initial release with full SEO scoring, accordions, and script pixel detector. | Draft |

---

## Review Notes

### Known Issues / Limitations
- Scripts loaded asynchronously via inline obfuscation or external web-workers may bypass static selector queries. We mitigate this by checking both direct DOM `<script>` tags and the standard `performance.getEntriesByType('resource')` API.
