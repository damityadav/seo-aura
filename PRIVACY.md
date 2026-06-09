# Privacy Policy for SEO Aura - Audit & Tracker Detector

Last updated: 2026-06-09

SEO Aura is committed to protecting your privacy. This Privacy Policy explains our data practices for the SEO Aura Chrome Extension.

## 1. Data Collection & Transmission

SEO Aura is built on a **local-first** architecture. We respect your privacy and do not collect, monitor, or store any personal data.

- **No Personal Data Collection:** The extension does not collect any personally identifiable information (PII) such as name, email address, address, or location.
- **Local Auditing:** All SEO audits (headings, content analysis, images extraction) and tracking script detections are executed entirely locally inside your browser tab context. No page content or analysis metrics are transmitted off your device.
- **PageSpeed Analysis:** When you request a PageSpeed Insights audit, the target URL is sent to the official public Google PageSpeed Insights API to perform the analysis. This request is initiated directly from your client-side browser to Google. No intermediary servers are used.
- **API Key Storage:** If you configure a custom Google PageSpeed API Key, it is saved locally on your device using `chrome.storage.local`. This key is never shared or sent to any server other than directly to Google's official API endpoint (`https://www.googleapis.com`) to run audits.

## 2. Third-Party Services

SEO Aura connects directly to the following third-party API:
- **Google PageSpeed Insights API:** Used solely to retrieve performance and Core Web Vitals diagnostics for URLs you explicitly scan.
  - Google's Privacy Policy can be reviewed here: [Google Privacy Policy](https://policies.google.com/privacy)

This extension does not use any analytics services (like Google Analytics or Mixpanel) or advertising tracking scripts.

## 3. Data Sharing & Retention

- **No Data Sharing:** Since no user data is collected or transmitted off-device, no data is sold, traded, or shared with third parties.
- **Data Deletion:** The custom API key stored in `chrome.storage.local` stays on your device until you manually clear it in the extension settings, or uninstall the extension.

## 4. Changes to This Policy

We may update this Privacy Policy occasionally. When we do, we will update the "Last updated" date at the top of this page. We encourage you to review this policy periodically.

## 5. Contact Us

If you have any questions or concerns about this Privacy Policy or the data practices of SEO Aura, please contact us at:

- **Email:** damityadavdigital@gmail.com
- **GitHub Repository:** https://github.com/damityadav/seo-aura
