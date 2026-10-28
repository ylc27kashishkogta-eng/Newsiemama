---
title: "Implementation Plan: Curio Dispatch — Personalized Digital Newspaper MVP"
date: 2026-10-28
type: feat
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-brainstorm
execution: code
---

## Goal Capsule

### Objective
Deliver a responsive, distraction-free digital newspaper web application where readers receive a personal daily morning edition tailored to their topics of interest and explained in their chosen conversational voice, rendered in an animated modern magazine layout with clear publisher attribution and zero setup friction.

### Means
A modern frontend application using React, Vite, Tailwind CSS, and Lucide icons, operating with local profile isolation (LocalStorage), permitted public publisher RSS feeds with pre-bundled sample story fallbacks, an offline-capable conversational tone adapter, and explicit integration slots for October 31 external setups (Dodo Payments, Microsoft Clarity, Google Search Console).

### Product Authority
Governed by the reader's stated product goals and session-settled decisions from the collaborative brainstorm. Surrounding capabilities (automated paid scrapers, full cloud authentication, automated email delivery) remain non-active scope.

### Open Blockers
None for Tonight's usable MVP. Third-party account configurations (Dodo Payments merchant account, Microsoft Clarity project ID, Google Search Console domain verification) and publisher-specific Apify legal reviews are scheduled as standalone setup tracks for October 31.

---

## Product Contract

*(Product Contract unchanged; enriched with implementation planning below.)*

### Summary
Curio Dispatch is an editorial personal newspaper that turns daily news into a finite, calm morning briefing. The application presents stories in an animated magazine card layout bearing the reader's name (e.g. *Aarav's Daily Briefing*), clearly attributes reputable sources (The Economic Times, Indian Express, India Today, BBC), and provides an interactive story drawer that translates news into the reader's chosen conversational voice.

### Problem Frame
Traditional news aggregation platforms rely on algorithmic infinite scrolling designed to maximize ad impressions, exposing readers to cognitive fatigue, sensationalism, and fragmented publisher websites cluttered with popups. Readers lack a calm, finite briefing that respects their time, adapts to their topics, and explains complex economic or policy developments in an accessible voice they actually enjoy reading.

### Key Decisions
- **Delivery Model: Morning Edition with On-Demand Refresh** (session-settled: user-directed — chosen over Strict Finite Daily Edition and Continuous Editorial Wire: delivers a calm, finite daily completion state while providing an explicit 'Refresh Edition' trigger for breaking afternoon news). Governs R1, R2, R5.
- **Voice / Tone Personalization: Dual Mode (Presets + Writing Sample)** (session-settled: user-directed — chosen over Structured Preference Sliders and Persona Roleplay Cards: provides instant high-signal presets [Executive Brief, Conversational Explainer, Storyteller] while offering a 100-word writing sample analyzer to extract personal tone markers). Governs R10, R11, R12.
- **News Sourcing Baseline: Curated Permitted RSS Feeds + Sample Fallback** (session-settled: user-directed — chosen over Custom Feed Hub and Simulated Wire: prioritizes official public publisher syndication feeds with prominent attribution links, guaranteeing zero demo failure via rich pre-bundled snapshots). Governs R14, R15, R16.
- **Apify News Collection Track: Rigorous Investigation Option** (session-settled: user-directed — chosen over blind scraper adoption or premature exclusion: preserves Apify as an exploratory track, auditing available actors, data collection scope, compute costs, and publisher Terms of Service before adopting paid scraping). Governs R18, R19, R20.
- **Profile Management: Instant Local Multi-Profile Switcher** (session-settled: user-directed — chosen over Simulated Session Gate and Cloud Auth Ready: eliminates all onboarding friction for GitHub reviewers while preserving 100% preference isolation across multiple readers via LocalStorage). Governs R6, R7, R8.
- **Visual Design: Option B Modern Magazine** (session-settled: user-directed — chosen over Classic Broadsheet and Executive Briefing: features card-based editorial hierarchy, generous whitespace, soft rounded cards, and subtle CSS page-turn/fade animations). Governs R3, R4.
- **Phased Delivery: Tonight MVP vs. Oct 31 External Setups** (session-settled: user-directed — chosen over monolithic delivery: ensures a complete, usable, zero-dependency working app tonight, reserving external account setups for Dodo Payments, Clarity, and Search Console for October 31). Governs R21, R22, R23, R24.

### Requirements

#### Edition Packaging and Editorial Presentation
- R1. The application must display a prominent masthead identifying the owner of the edition (e.g., "Aarav Sharma's Daily Briefing"), the edition date, volume number, and generation timestamp.
- R2. The edition must present a finite set of curated stories organized by relevance to the reader's selected topics, terminating with a clear "You are caught up for today" completion indicator.
- R3. The layout must follow the Modern Magazine direction, using responsive card-based editorial grids, generous whitespace, high-contrast typography, and category tag badges.
- R4. The interface must incorporate purposeful, subtle CSS animations (fade-in, paper-load transition, and drawer slide) that enhance the tactile feel without slowing down reading.
- R5. The masthead must include an on-demand "Refresh Edition" button that re-evaluates feeds and appends updated timestamps.

#### Personalization and Profile Management
- R6. Readers must be able to switch instantly between multiple distinct profiles (pre-seeded with "Aarav — Tech & Markets" and "Priya — Policy & Global Affairs", plus a "+ Add Reader" flow).
- R7. Each reader profile must store its own name, topic interests, active voice preset, custom writing sample, and reading history in browser LocalStorage.
- R8. Topic selection must allow readers to toggle categories including Indian Markets & Economy, Technology & AI, National Policy & Governance, World Intelligence, and Climate/Infrastructure.
- R9. Profile state must be completely isolated so that changes made by one reader do not affect another reader's edition or reading voice.

#### Conversational Voice and Story Explainer
- R10. The application must provide three built-in voice presets:
  - *Executive Brief:* High-density, bulleted takeaways, impact analysis, and "Why it matters".
  - *Conversational Explainer:* Friendly, approachable language using everyday analogies to unpack jargon.
  - *Storyteller:* Narrative, context-rich journalism framing the story as a compelling unfolding event.
- R11. The application must provide a "Teach My Voice" drawer allowing readers to paste a 100-word sample of their own writing, extracting tone markers (brevity, formality, sentence rhythm) into their profile.
- R12. Clicking any story must open a focused reading view with the original excerpt, canonical link, and an interactive "Explain This in My Voice" drawer presenting the rewritten briefing.
- R13. The story explainer must operate deterministically out of the box using built-in template adapters, with an optional Settings field for a user-supplied Gemini or OpenAI API key (BYOK) for dynamic rewrites.

#### News Ingestion, Permitted Feeds, and Fallbacks
- R14. The system must ingest stories from official, permitted public RSS feeds of reputable publishers, initially configured for The Economic Times, The Indian Express, India Today, and BBC News.
- R15. Every displayed story must clearly feature prominent publisher badges, publication timestamps, and a prominent outbound link directing readers to the original canonical article.
- R16. The application must bundle a rich, pre-cached snapshot of verified stories across all topics, automatically activating when live feed requests are unavailable, offline, or blocked by network restrictions.
- R17. Feed parsing must be resilient to CORS and network timeouts, displaying transparent status indicators ("Live Feed" vs. "Cached Morning Snapshot").

#### Apify News Collection Track (Exploratory)
- R18. The project documentation must include an Apify Feasibility Evaluation section assessing actor availability for Indian news portals, monthly compute costs, and publisher Terms of Service.
- R19. The codebase must define a clean `NewsSourceAdapter` interface, allowing Apify actor webhooks or API outputs to plug into the ingestion pipeline in a future release without UI rewrites.
- R20. The application must enforce that any collected content adheres to publisher robots.txt directives and fair-use excerpt limitations, never storing full paywalled article texts.

#### October 31 Integration Readiness (Payments, Analytics, SEO)
- R21. The codebase must include a dedicated Dodo Payments module with a "Supporter Edition" badge, mock checkout modal, and documented instructions for plugging in production API keys and webhook secrets.
- R22. The application must include an analytics configuration file ready to accept a Microsoft Clarity project tracking code, with pre-wired custom engagement tags for story expansion and tone switches.
- R23. The project must include production SEO scaffolding: a generated `sitemap.xml`, a configured `robots.txt`, OpenGraph social share cards, and a designated tag slot for Google Search Console HTML verification.
- R24. Setup instructions for Dodo Payments, Microsoft Clarity, and Google Search Console must be documented in a dedicated `docs/integrations-oct31.md` guide.

### Scope Boundaries

#### In Scope for Tonight (Milestone 1)
- Complete responsive frontend built with React, Vite, and Tailwind CSS.
- Modern Magazine animated layout with edition masthead and personal ownership indicators.
- Instant LocalStorage multi-profile switcher with pre-seeded profiles and custom profile creator.
- Topic selector and dual-mode conversational voice engine (3 presets + 100-word sample analyzer).
- Curated permitted RSS ingestion with seamless offline/sample content fallback.
- Story reader view with conversational rewrite drawer and prominent publisher links.
- Code architecture prepared with adapter interfaces for future scrapers and payment hooks.
- Comprehensive `README.md` with zero-friction local run commands.

#### Deferred to October 31 (Milestone 2)
- Registering and verifying the custom domain on Google Search Console.
- Adding the live Microsoft Clarity tracking code and reviewing initial session heatmaps.
- Creating the Dodo Payments merchant product, setting webhook endpoints, and testing live checkout.
- Executing the detailed Apify actor benchmark and cost analysis.

#### Outside This Product's Identity
- Automated web scraping that ignores publisher robots.txt or circumvents paywalls.
- Automated harvesting of private user chat conversations from third-party platforms.
- Mandatory cloud authentication or database setup for basic evaluation.
- Infinite-scroll endless news wires.

### Key Flows

#### F1. Daily Morning Edition Reading
- **Trigger:** Reader opens the application or selects their profile.
- **Actors:** Reader
- **Steps:** System loads reader preferences from LocalStorage; retrieves matching cached or live RSS stories for their topics; renders the animated magazine masthead with reader name and today's date; displays lead story and category cards; presents "You are caught up" footer.
- **Covered by:** R1, R2, R3, R4, R6, R14, R16

#### F2. Conversational Story Explanation
- **Trigger:** Reader clicks "Explain in my voice" on any news story.
- **Actors:** Reader, Tone Transformer
- **Steps:** Story drawer slides open; shows original headline and publisher link; tone transformer evaluates reader's active preset or writing sample profile; generates concise, jargon-free explanation with key takeaways; allows reader to toggle alternative presets on the fly.
- **Covered by:** R10, R11, R12, R13, R15

#### F3. Multi-Profile Switching and Creation
- **Trigger:** Reader clicks profile avatar in the masthead.
- **Actors:** Reader
- **Steps:** Dropdown displays available reader profiles; reader selects a different profile or clicks "Add Profile"; interface transitions smoothly to display the selected reader's customized front page, topics, and voice settings.
- **Covered by:** R6, R7, R8, R9

#### F4. On-Demand Edition Refresh
- **Trigger:** Reader clicks "Refresh Edition" in the masthead.
- **Actors:** Reader, Feed Parser
- **Steps:** System polls configured RSS endpoints; merges newly published stories into the existing issue; updates edition timestamp with a "Refreshed at HH:MM" notification; gracefully maintains existing stories if offline.
- **Covered by:** R5, R14, R17

### Acceptance Examples

#### AE1. Zero-Friction Cold Start with Sample Content
- **Given:** A fresh environment with no network connection or invalid RSS endpoints.
- **When:** The user clones the repo and runs `npm run dev`.
- **Then:** The application opens immediately displaying "Aarav's Daily Briefing", populated with high-quality bundled stories from The Economic Times, Indian Express, and India Today, with zero crash or blank screens.

#### AE2. Preference Isolation Between Readers
- **Given:** Profile A ("Aarav") has Tech & Markets with "Executive Brief" voice; Profile B ("Priya") has Policy with "Storyteller" voice.
- **When:** User switches from Aarav to Priya in the masthead.
- **Then:** The masthead title updates to "Priya's Daily Briefing", the story feed reorganizes to highlight Policy stories, and opening any story explainer defaults to the "Storyteller" narrative tone.

#### AE3. Writing Sample Tone Adaptation
- **Given:** Reader pastes a 100-word writing sample in the "Teach My Voice" drawer and saves.
- **When:** Reader clicks "Explain in my voice" on an economic policy article.
- **Then:** The explanation reflects the reader's extracted profile markers (e.g. conversational analogies or bulleted brevity) and displays a badge indicating "Voiced via your personal writing sample".

#### AE4. Verifiable Publisher Attribution
- **Given:** A story card rendered on the front page.
- **When:** The user inspects the story card.
- **Then:** The publisher name (e.g. "The Economic Times"), time elapsed (e.g. "2h ago"), and an external link icon opening the canonical publisher article in a new tab are clearly visible.

### Assumptions and Risks

#### Assumptions
- Public RSS feeds from The Economic Times, Indian Express, and India Today remain publicly accessible without requiring publisher API tokens.
- Modern browser LocalStorage is sufficient for storing 10+ reader profiles, topic preferences, and sample voice vectors without exceeding storage quotas.
- Evaluators and student project reviewers prefer an instant zero-credential demo over complex cloud auth dependencies.

#### Risks and Mitigations
- **Risk:** Public RSS feeds fail due to CORS restrictions when queried directly from the browser.
  - *Mitigation:* Implement a lightweight client-side CORS proxy handler with an immediate, seamless fallback to the pre-bundled snapshot dataset.
- **Risk:** Apify scraping might trigger publisher IP rate-limits, Cloudflare blocks, or violate Terms of Service.
  - *Mitigation:* Treat Apify strictly as an exploratory investigation track documented in `docs/apify-investigation.md`, keeping the active core MVP powered by permitted RSS and verified samples.
- **Risk:** External setup tasks (Dodo Payments, Clarity, GSC) distract from tonight's deadline.
  - *Mitigation:* Isolate all October 31 tasks into standalone modular configuration files and dedicated documentation, requiring zero external setups for tonight's core review.

### Sources and Legal Attribution Contract
- All stories must display original publication source names and link directly to canonical publisher URLs.
- The application must not attempt to scrape or republish full copyrighted paywall content; it operates exclusively on official RSS excerpts and headline decks.
- A prominent disclaimer in the footer must state: *"Curio Dispatch is an educational digital newspaper prototype. News headlines and summaries are syndications of official public RSS feeds from their respective copyright owners."*

---

## Planning Contract

### Technical Architecture
The client is a single-page application built on Vite, React 19, TypeScript, and Tailwind CSS. The architecture is intentionally decoupled into layered modules:

1. **Presentation Layer:**
   - Editorial typography utilizing Google Fonts (`Newsreader` for editorial prose, `Cinzel` for classical accent, `Plus Jakarta Sans` for UI readability, and `IBM Plex Mono` for timestamps/provenance tags).
   - Component hierarchy: `App` -> `Masthead` -> `TopicNavigation` -> `FrontPage` (`LeadStoryHero`, `StoryGrid`, `QuickTicker`) -> `StoryDrawer` -> `VoiceModal`.
   - Tailwind utility styling augmented by custom animation primitives (gentle page fade-in, paper drop, slide-over drawer).

2. **State & Profile Management Layer:**
   - `ProfileContext` maintaining the active `ReaderProfile` (`id`, `name`, `topics`, `voicePreset`, `customVoiceSample`, `history`).
   - Storage synchronization via a strongly typed `localStorage` wrapper with JSON schema validation and zero-dependency fallbacks.

3. **News Ingestion & Adapter Layer:**
   - Unified `NewsSourceAdapter` interface:
     ```typescript
     export interface NewsSourceAdapter {
       fetchStories(topics: string[]): Promise<Story[]>;
     }
     ```
   - Two concrete implementations:
     - `RSSFeedAdapter`: Fetches live RSS XML via public CORS proxies (`api.allorigins.win` or `rss2json`), parses XML to `Story[]` entities, and caches results.
     - `SnapshotFeedAdapter`: Deterministic local dataset of verified recent Indian & global headlines with rich categories, decks, and canonical links.
     - `ApifyAdapterStub`: Interface stub with parameter contracts and documentation pointers ready for actor token integration.

4. **Conversational Voice Engine Layer:**
   - Rule-based algorithmic tone transform with semantic heuristic dictionary (extracts sentence count, jargon replacement, key takeaway formatting).
   - Pluggable LLM connector: If a user enters a Gemini API key or OpenAI key in Settings, the engine swaps to live LLM rewriting via streaming API.

5. **October 31 Scaffolding Layer:**
   - Dedicated `src/integrations/` directory containing `dodoPayments.ts`, `clarity.ts`, and public SEO assets (`sitemap.xml`, `robots.txt`).

### Key Technical Decisions
- **KTD1: Pure Client-Side Single Page Application (Vite + React + TypeScript)** (session-settled: user-directed — chosen over Next.js/SSR: allows instant zero-friction hosting on GitHub Pages or Vercel, requires no backend server maintenance, and provides instantaneous local startup via `npm run dev`). Governs U1, U2, U4.
- **KTD2: LocalStorage for Multi-Profile Isolation** (session-settled: user-directed — chosen over SQLite/Supabase: ensures the repository can be cloned and tested locally in 30 seconds without creating cloud accounts or setting database environment variables). Governs U2.
- **KTD3: Dual-Stage Feed Ingestion with Deterministic Offline Fallback** (session-settled: user-directed — chosen over live-only RSS or mock-only: protects against university/corporate firewall blocks and CORS proxy downtimes during live grading/demos). Governs U3.
- **KTD4: Pluggable Tone Engine with Zero-Key Default** (session-settled: user-directed — chosen over mandatory API key: guarantees every evaluator experiences the conversational voice feature immediately, with an optional BYOK field for evaluator API testing). Governs U5.
- **KTD5: Modular Scaffolding for October 31 Integrations** (session-settled: user-directed — chosen over post-hoc refactoring: embeds clean extension seams for Dodo Payments, Clarity, and Search Console today without complicating tonight's MVP code paths). Governs U6.

---

## Implementation Units

### U1. Project Scaffolding, Design Tokens & Animation Primitives
- **Goal:** Set up a clean, high-performance Vite + React + TypeScript project with Tailwind CSS, custom editorial font loading, and animation utility classes.
- **Requirements Covered:** R3, R4
- **Files to Create / Modify:**
  - `package.json`: Dependencies (`react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`, `vite`, `tailwindcss`, `@tailwindcss/vite`).
  - `vite.config.ts`: Vite bundler configuration.
  - `index.html`: Webpage title "Curio Dispatch | Your Personal Newspaper", meta viewport, and Google Fonts preconnect (`Newsreader`, `Cinzel`, `Plus Jakarta Sans`, `IBM Plex Mono`).
  - `src/index.css`: Tailwind directives, custom font family variables, and CSS animation keyframes (`@keyframes paperFade`, `@keyframes slideDrawer`).
  - `src/App.tsx`: Base application shell and layout wrapper.
- **Implementation Steps:**
  1. Initialize repository files and configure `package.json` with modern React 19 + Vite dependencies.
  2. Configure CSS styles with semantic color tokens (`--paper-bg: #f8f6f0`, `--ink-primary: #18181b`, `--ink-muted: #52525b`, `--accent-crimson: #991b1b`).
  3. Define custom utility animations for tactile newspaper feel: paper fade-in on edition load, subtle card hover lift, and smooth reader drawer transition.
- **Verification:**
  - Run `npm install` and `npm run build` with zero compiler warnings.
  - Ensure Google Fonts load cleanly in Chrome DevTools Network tab.

### U2. Data Contracts, LocalStorage Profile Engine & Pre-seeded Personas
- **Goal:** Define canonical TypeScript interfaces for stories, profiles, and voice personas, and implement a robust LocalStorage profile management system.
- **Requirements Covered:** R6, R7, R8, R9
- **Files to Create / Modify:**
  - `src/types/index.ts`: Data definitions (`Story`, `ReaderProfile`, `TopicCategory`, `VoicePreset`, `EditionMetadata`).
  - `src/services/storageService.ts`: LocalStorage persistence helper with schema migrations and default seed profiles.
  - `src/context/ProfileContext.tsx`: React Context exposing `currentProfile`, `switchProfile`, `updateTopics`, `setVoicePreset`, `saveWritingSample`, and `createProfile`.
- **Implementation Steps:**
  1. Write strict TypeScript interfaces in `src/types/index.ts`.
  2. Implement `storageService.ts` with default seed data:
     - Profile 1: *Aarav Sharma* (Topics: Indian Markets & Economy, Technology & AI; Voice: `conversational`).
     - Profile 2: *Priya Patel* (Topics: National Policy & Governance, World Intelligence; Voice: `executive`).
  3. Build `ProfileContext.tsx` to handle reactive profile switching and LocalStorage persistence.
- **Verification:**
  - Switch between profiles in the UI; verify `localStorage.getItem('curio_profiles')` updates accurately.
  - Reload page; confirm active profile and topic selections survive refresh.

### U3. News Ingestion Engine: Permitted RSS, Snapshot Fallback & Apify Adapter
- **Goal:** Build a resilient news ingestion service that pulls live stories from official publisher RSS feeds, falls back smoothly to a rich bundled dataset, and provides an Apify adapter contract.
- **Requirements Covered:** R14, R15, R16, R17, R18, R19, R20
- **Files to Create / Modify:**
  - `src/data/sampleStories.ts`: Rich pre-cached dataset of 18+ verified stories from The Economic Times, Indian Express, India Today, and BBC News with realistic headlines, summaries, and canonical URLs.
  - `src/services/feedService.ts`: Core news service fetching from public RSS feeds (`economictimes.indiatimes.com`, `indianexpress.com`, etc.) via CORS proxies, with automatic fallback to `sampleStories.ts`.
  - `src/services/adapters/NewsSourceAdapter.ts`: Adapter interface.
  - `src/services/adapters/ApifyAdapter.ts`: Structured stub showing how an Apify Actor output schema maps into `Story[]`.
- **Implementation Steps:**
  1. Assemble verified headline data across Indian Markets, Technology, Policy, and World News in `sampleStories.ts`.
  2. Implement RSS XML parser in `feedService.ts` utilizing `DOMParser` or lightweight JSON feed proxies.
  3. Implement timeout and error traps: if CORS fails or network is offline, seamlessly return cached snapshot stories marked with `sourceMode: 'snapshot'`.
  4. Write `ApifyAdapter.ts` with comprehensive type mappings and comments documenting actor input/output payloads.
- **Verification:**
  - Disconnect network in browser; verify the application still displays complete, attributed news stories with zero crash.
  - Inspect story cards; confirm publisher badges (e.g. "The Economic Times • 2h ago") and valid outbound links.

### U4. Animated Magazine Front Page & Edition Masthead
- **Goal:** Create the editorial visual interface featuring the reader's personalized masthead, topic navigation, responsive card-based story grid, and edition refresh trigger.
- **Requirements Covered:** R1, R2, R3, R4, R5
- **Files to Create / Modify:**
  - `src/components/Masthead.tsx`: Classical-modern masthead with edition date, volume number, reader name ("Aarav's Daily Briefing"), edition refresh button, and profile switcher dropdown.
  - `src/components/TopicBar.tsx`: Horizontal topic category pills with active indicators and quick toggles.
  - `src/components/LeadStoryCard.tsx`: Prominent hero card for the top story with editorial deck and inline "Explain in my voice" trigger.
  - `src/components/StoryCard.tsx`: Clean secondary story cards with publication metadata, category pill, and reading estimate.
  - `src/components/QuickTicker.tsx`: Right-rail "In Brief Today" digest column.
  - `src/components/FrontPage.tsx`: Layout orchestration component tying together hero, grid, ticker, and "You are caught up" footer.
- **Implementation Steps:**
  1. Build `Masthead.tsx` displaying the edition owner prominently with volume/date metadata and a profile switcher modal.
  2. Implement `FrontPage.tsx` adhering to the Modern Magazine aesthetic: generous whitespace, high-contrast serif headlines, subtle borders, and smooth card transitions.
  3. Add the "Refresh Edition" interaction with rotating sync animation and updated timestamp notification.
  4. Implement the completion footer: "— You are caught up for today's morning edition —".
- **Verification:**
  - Verify layout responsiveness across desktop (3-column), tablet (2-column), and mobile (single-column).
  - Check that clicking "Refresh Edition" re-triggers animation and updates timestamp.

### U5. Conversational Voice Engine & Story Explainer Drawer
- **Goal:** Build the interactive voice personalization engine featuring 3 preset personas, a 100-word writing sample analyzer, and a sliding story reading drawer.
- **Requirements Covered:** R10, R11, R12, R13
- **Files to Create / Modify:**
  - `src/services/toneEngine.ts`: Algorithmic conversational rewriter transforming story decks into Executive Brief (bulleted impact), Conversational Explainer (friendly analogies), or Storyteller (narrative flow).
  - `src/services/voiceAnalyzer.ts`: Analyzes pasted 100-word sample text to compute formality, sentence length, and vocabulary tone markers.
  - `src/components/StoryDrawer.tsx`: Slide-over drawer displaying full article overview, publisher attribution link, and conversational rewrite.
  - `src/components/VoiceSettingsModal.tsx`: Modal for choosing presets, pasting writing samples, or configuring optional Gemini/OpenAI BYOK keys.
- **Implementation Steps:**
  1. Implement `toneEngine.ts` with tailored explanation templates and semantic translation heuristics for all topics.
  2. Build `voiceAnalyzer.ts` allowing readers to paste a paragraph of their writing to tune the persona.
  3. Build `StoryDrawer.tsx` with smooth CSS slide-over transition, active tone badge, and "Original Article on [Publisher] ↗" button.
  4. Provide an optional "API Settings" accordion in `VoiceSettingsModal` where evaluators can paste a Gemini/OpenAI API key to test live LLM generation.
- **Verification:**
  - Open a story; click "Explain in my voice"; verify explanation tone switches dynamically between Executive, Conversational, and Storyteller.
  - Paste a writing sample in settings; confirm custom tone badge renders on subsequent story explanations.

### U6. October 31 Integrations Scaffolding, Documentation & GitHub Packaging
- **Goal:** Prepare modular integration slots and documentation for Dodo Payments, Microsoft Clarity, and Google Search Console, and package a stellar GitHub-ready README.
- **Requirements Covered:** R21, R22, R23, R24
- **Files to Create / Modify:**
  - `src/integrations/dodoPayments.ts`: Dodo Payments client module with mock checkout trigger and production webhook guide.
  - `src/integrations/clarity.ts`: Microsoft Clarity initialization script with custom event tracking for story reads and tone switches.
  - `public/robots.txt`: Search crawler directives.
  - `public/sitemap.xml`: SEO sitemap template for broadsheet pages.
  - `docs/integrations-oct31.md`: Detailed setup guide for Dodo Payments, Microsoft Clarity, and Google Search Console.
  - `docs/apify-investigation.md`: Comprehensive feasibility and legal audit of Apify news actors, publisher ToS, and compute pricing.
  - `README.md`: Polished project documentation with screenshots, quick-start commands, architecture overview, and security statement.
- **Implementation Steps:**
  1. Build `dodoPayments.ts` and add a "Supporter Edition" button in the masthead that opens a mock checkout modal.
  2. Build `clarity.ts` ready to activate upon adding a Project ID in `src/config.ts`.
  3. Create SEO assets in `public/` and configure Google Search Console verification meta tag slot in `index.html`.
  4. Write `docs/integrations-oct31.md` detailing step-by-step registration instructions for each external service.
  5. Write `docs/apify-investigation.md` auditing The Economic Times, Indian Express, and India Today against Apify actors and terms of service.
  6. Author root `README.md` highlighting zero-friction local execution (`npm install && npm run dev`).
- **Verification:**
  - Click "Supporter Edition"; verify mock checkout dialog opens with clear explanation.
  - Inspect `index.html` and `public/`; confirm SEO files are present and valid.

---

## Verification Contract

### Automated Quality Gates
1. **Type Checking:** Run TypeScript compiler validation:
   ```bash
   npm run typecheck
   ```
   Must exit with code 0 and zero type errors.

2. **Production Build:** Run Vite production build:
   ```bash
   npm run build
   ```
   Must output optimized static assets in `dist/` with zero bundle errors.

### Manual Verification Scenarios
1. **Zero-Setup Cold Start:**
   - Clone repo into fresh directory.
   - Run `npm install` and `npm run dev`.
   - Confirm application loads within 2 seconds with "Aarav Sharma's Daily Briefing" and populated stories.
2. **Multi-Profile Switching:**
   - Click profile dropdown in masthead; select "Priya Patel".
   - Confirm headline shifts to "Priya Patel's Daily Briefing", topic filters switch to Policy & Governance, and story grid reorganizes.
3. **Conversational Voice Drawer:**
   - Click "Explain in my voice" on any story.
   - Verify drawer slides in from the right with zero layout distortion.
   - Switch between "Executive Brief", "Conversational Explainer", and "Storyteller" pills; verify explanation text updates instantly.
4. **Offline Resilience:**
   - Enable "Offline" mode in Chrome DevTools Network tab.
   - Click "Refresh Edition"; verify UI displays "Using cached morning snapshot" without crashing.

---

## Definition of Done

- [ ] All code is written in TypeScript with clean interfaces and zero `any` types.
- [ ] Application starts cleanly via `npm run dev` with zero console errors.
- [ ] Visual design strictly matches the agreed Modern Magazine card layout with responsive spacing and custom typography.
- [ ] Multi-profile switching functions seamlessly via LocalStorage with zero cloud setup.
- [ ] News feed ingestion reliably serves permitted RSS sources with instant fallback to verified sample stories.
- [ ] Conversational voice drawer renders readable explanations in 3 presets plus custom writing sample adaptation.
- [ ] October 31 integration scaffolding (Dodo Payments, Microsoft Clarity, GSC) and documentation guides (`docs/integrations-oct31.md`, `docs/apify-investigation.md`) are complete.
- [ ] Root `README.md` includes clear setup instructions, feature walk-through, and architectural diagrams.
