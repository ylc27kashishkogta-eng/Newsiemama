# Curio Dispatch 📰
> *A personalized, distraction-free digital newspaper delivering calm morning editions tailored to your topics and explained in your conversational voice.*

---

## Highlights

- **Editorial Magazine Layout:** High-contrast editorial typography (`Newsreader`, `Cinzel`, `Plus Jakarta Sans`), generous whitespace, and subtle tactile CSS animations.
- **Personalized Editions:** The masthead prominently identifies the edition owner (e.g., *"Aarav Sharma's Newsroom"* or *"Priya Patel's Newsroom"*), with full customization to set your own newspaper title.
- **Multi-Profile Isolation:** Instant profile switching with 100% isolated topics, reading voices, and reading lists stored locally via `LocalStorage` — zero database or cloud auth prerequisites.
- **Permitted News Ingestion & Zero-Friction Fallback:** Official public RSS syndication (The Economic Times, The Indian Express, Mint, India Today, BBC News) with automatic, seamless fallback to high-fidelity snapshot content for offline or demo evaluation.
- **Conversational Voice Engine:** Translates complex news into 3 built-in voices (*Executive Brief*, *Conversational Explainer*, *Storyteller*) plus a **"Teach My Voice"** 100-word sample analyzer.
- **Clean Extensibility:** Clean adapter interfaces for Apify actors, and modular scaffolding for **Dodo Payments**, **Microsoft Clarity**, and **Google Search Console** (October 31 milestones).

---

## Quick Start (Run Locally in 30 Seconds)

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation & Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/curio-dispatch.git
cd curio-dispatch

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## Project Architecture

```
src/
├── components/          # Editorial newspaper UI components
│   ├── FrontPage.tsx    # Broadsheet grid orchestration & completion indicator
│   ├── LeadStoryCard.tsx# Hero story with editorial deck and pull quote
│   ├── Masthead.tsx     # Classical-modern edition header with profile switcher
│   ├── ProfileModal.tsx # Multi-reader profile manager & creator
│   ├── QuickTicker.tsx  # In Brief today scannable digest rail
│   ├── StoryCard.tsx    # Secondary article cards with publisher badges
│   ├── StoryDrawer.tsx  # Slide-over reader with conversational voice rewrite
│   ├── SupporterModal.tsx# Dodo Payments Patron checkout stub
│   ├── TopicBar.tsx     # Topic filter pills
│   └── VoiceSettingsModal.tsx # Preset picker & 100-word sample analyzer
├── context/
│   └── ProfileContext.tsx # Reactive profile & topic state provider
├── data/
│   └── sampleStories.ts # Verified offline snapshot dataset across 5 topics
├── integrations/        # October 31 service scaffolding
│   ├── clarity.ts       # Microsoft Clarity telemetry client
│   └── dodoPayments.ts  # Dodo Payments checkout client
├── services/
│   ├── feedService.ts   # News ingestion with automatic CORS & offline fallback
│   ├── storageService.ts# LocalStorage persistence & schema migrations
│   ├── toneEngine.ts    # Algorithmic conversational explanation rewriter
│   ├── voiceAnalyzer.ts # 100-word sample cadence & formality analyzer
│   └── adapters/        # Ingestion adapters
│       ├── NewsSourceAdapter.ts # Unified source interface
│       └── ApifyAdapter.ts      # Apify Actor contract & compliance stub
└── types/
    └── index.ts         # TypeScript data contracts
```

---

## Pre-seeded Reader Personas

Curio Dispatch includes two pre-configured reader profiles to test multi-reader isolation immediately:

1. **Aarav Sharma:**
   - **Topics:** Markets & Economy, Technology & AI
   - **Voice:** *Conversational Explainer* (jargon-free everyday analogies)
   - **Sample Voice:** Casual, high-energy takeaway style
2. **Priya Patel:**
   - **Topics:** Policy & Governance, World Intelligence, Climate & Infra
   - **Voice:** *Executive Brief* (sharp bullet points, regulatory/macro impact)
   - **Sample Voice:** Formal executive analysis

Click the reader name in the masthead to switch profiles or create a new edition!

---

## Legal & Compliance Attribution

- All stories display original publisher names (The Economic Times, The Indian Express, India Today, BBC News, Mint) and link directly to canonical source URLs.
- The application does not scrape paywalled content or republish full copyrighted texts; it syndicates official public RSS excerpts for educational and feed reader purposes.

---

## Roadmap

- **Tonight (Oct 28):** ✅ Complete usable MVP with multi-profile broadsheet, voice explainer, offline fallback, and permitted RSS syndication.
- **October 31:** 
  - [ ] Connect production Dodo Payments merchant key for Patron subscriptions ([Guide](docs/integrations-oct31.md)).
  - [ ] Activate Microsoft Clarity project tracking ([Guide](docs/integrations-oct31.md)).
  - [ ] Verify domain on Google Search Console ([Guide](docs/integrations-oct31.md)).
  - [ ] Conduct Apify actor benchmarks on non-paywalled media archives ([Investigation](docs/apify-investigation.md)).
