# Apify News Collection Feasibility & Legal Audit

**Prepared for:** Curio Dispatch Engineering Architecture  
**Status:** Exploratory / Deferred Track  
**Recommendation:** Retain official public RSS feeds as primary ingestion; treat Apify as an optional, paid enhancement only for non-RSS publisher archives.

---

## 1. Publisher Landscape & Existing RSS Availability

| Publisher | Official RSS Available? | Robots.txt Stance | Paywall Status | Assessment |
|---|---|---|---|---|
| **The Economic Times** | **Yes** (Multiple section feeds) | Allows syndication crawlers; disallows deep archive brute crawls | Metered / Freemium (ET Prime paywalled) | **RSS is optimal.** Official feeds provide title, deck, timestamp, and canonical link with zero bot-blocking risk. |
| **The Indian Express** | **Yes** (Full section feeds) | Permits standard user agents on public feeds; limits aggressive scraping | Free with registration | **RSS is optimal.** Public RSS feed delivers up-to-date national and business reporting. |
| **India Today** | **Yes** (RSS & Video feeds) | Standard commercial robots.txt; protects subscriber media | Free / Ad-supported | **RSS is optimal.** Official RSS syndication is fully permitted for feed readers. |
| **Mint (Livemint)** | **Yes** (Topic RSS feeds) | Disallows full-text scrapers; protects premium subscriber analysis | Premium paywall on deep features | **RSS is optimal.** Public feeds give valid summaries without paywall infringement. |
| **BBC News (India/World)** | **Yes** (Global RSS feeds) | Strict fair-use non-commercial terms for syndication | Free global public | **RSS is optimal.** Very stable syndication endpoints. |

---

## 2. Apify Actor Availability & Capabilities

Apify maintains several pre-built Actors on the Apify Store:

1. **`apify/web-scraper` / `apify/playwright-scraper` (Generic Crawlers):**
   - *Pros:* Can navigate dynamic JavaScript-rendered single-page apps.
   - *Cons:* Heavy compute footprint. Frequent failures when publishers update DOM selectors or deploy Cloudflare Turnstile / Akamai bot detection.
2. **`lukaskrivka/article-extractor-smart`:**
   - *Pros:* Automatically parses article headlines, author, and main body text.
   - *Cons:* Regularly triggers CAPTCHA challenges on Indian media sites with strict CDN rate-limiting.

---

## 3. Cost & Compute Profile (Apify Pricing)

- **Free Tier:** \$5 monthly compute credits (~50–80 crawl runs depending on memory and proxy usage).
- **Residential Proxies:** Required if publishers employ Cloudflare or Akamai bot walls (\$8–\$12 / GB of proxy bandwidth).
- **Starter Plan:** \$49 / month (typically required if running daily scheduled cron scrapers across 5+ major publishers).

---

## 4. Legal & Terms of Service (ToS) Review

1. **Copyright & Fair Use:**
   - Scraping and reproducing entire article bodies without publisher licensing constitutes copyright infringement.
   - In contrast, ingesting official RSS feeds, displaying excerpts/decks, and linking back directly to the original publisher URL is standard, legally protected syndication practice.
2. **Breach of Terms of Service:**
   - Most publisher websites (e.g. Times Internet ToS) explicitly forbid automated scraping or extraction of proprietary content for commercial resale.
3. **Verdict:**
   - **Do NOT scrape full text behind paywalls.**
   - Relying on official publisher RSS feeds eliminates all legal risk, prevents bot-wall failures, and ensures zero dollar operating cost for student demonstrations.
   - An adapter stub (`src/services/adapters/ApifyAdapter.ts`) is maintained in the codebase so that an authorized publisher API or permitted Apify webhook can be bound if a licensing agreement is established in the future.
