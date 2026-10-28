# October 31 Integrations Guide: Payments, Analytics & SEO

This document provides step-by-step setup checklists for the three external service integrations scheduled for October 31.

---

## 1. Dodo Payments (Monetization & Patron Tiers)

**Purpose:** Provide readers with an optional monthly subscription to support Curio Dispatch and unlock early edition delivery.

### Setup Checklist
1. **Account Registration:** Sign up at [dodopayments.com](https://dodopayments.com).
2. **Product Configuration:**
   - Name: `Curio Dispatch Patron Edition`
   - Billing: Recurring Monthly
   - Price: `$4.99 / month`
3. **API Keys:**
   - Copy your **Publishable API Key** and **Secret Key**.
   - Create a local `.env.local` file:
     ```env
     VITE_DODO_PAYMENTS_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
     ```
4. **Webhook Integration:**
   - Register your production webhook endpoint (e.g. `/api/webhooks/dodo` on Cloudflare Workers or Vercel).
   - Listen for `checkout.session.completed` and `subscription.renewed`.
   - Update user profile status to `isPatron: true`.

---

## 2. Microsoft Clarity (Behavioral Analytics & Heatmaps)

**Purpose:** Understand reader behavior—which headlines get clicked, how deep readers scroll, and which explanation voices are favored—with zero cookie friction or GDPR issues.

### Setup Checklist
1. **Account Creation:** Sign in at [clarity.microsoft.com](https://clarity.microsoft.com).
2. **Create Project:**
   - Name: `Curio Dispatch`
   - Website URL: `https://your-domain.pages.dev`
3. **Retrieve Project ID:**
   - Copy your alphanumeric project token (e.g. `k8q2jx9m`).
   - Add to `.env.local`:
     ```env
     VITE_CLARITY_PROJECT_ID=k8q2jx9m
     ```
4. **Verify Custom Tags:**
   - The application already includes pre-wired custom event dispatches:
     - `story_opened` (tracks story category and title)
     - `voice_preset_changed` (tracks adoption of Executive, Conversational, or Storyteller)
     - `profile_switched` (tracks multi-reader switches)

---

## 3. Google Search Console (SEO & Domain Authority)

**Purpose:** Ensure Google indexes daily edition archives, monitors site health, and verifies domain ownership.

### Setup Checklist
1. **Property Creation:** Go to [search.google.com/search-console](https://search.google.com/search-console).
2. **Choose Verification Method:**
   - **Method A (HTML Tag):** Copy the meta tag provided by Google:
     ```html
     <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />
     ```
     Uncomment and insert it into `index.html`.
   - **Method B (DNS Record):** Add a TXT record to your DNS host (Cloudflare, Namecheap, Vercel).
3. **Submit Sitemap:**
   - In Search Console left navigation, select **Sitemaps**.
   - Enter `sitemap.xml` (already deployed at `public/sitemap.xml`).
4. **Validate Robots.txt:**
   - Ensure `public/robots.txt` allows all crawler access to `/`.
