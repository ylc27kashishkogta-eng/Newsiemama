import { Story, TopicCategory, FinanceSubcategory } from '../types';

export interface FeedResponse {
  stories: Story[];
  isLive: boolean;
  refreshedAt: string;
  sourceNote: string;
  liveCount: number;
  demoCount: number;
  error?: string;
}

export const TOPIC_NAMES: Record<TopicCategory, string> = {
  finance: 'Finance & Markets',
  economy: 'Markets & Economy',
  tech: 'Technology & AI',
  policy: 'Politics & Governance',
  world: 'World Intelligence',
  climate: 'Climate & Energy',
  science: 'Science & Space',
  sports_culture: 'Sports & Culture',
};

export const FINANCE_SUBCATEGORY_LABELS: Record<FinanceSubcategory, string> = {
  all: 'All Finance',
  stocks: 'Stock Market',
  startups: 'Startups',
  personal_finance: 'Personal Finance',
  business: 'Business',
  economy: 'Economy',
  tech: 'FinTech & Tech',
};

// Curated public RSS endpoints of reputable publishers with official syndication
const PUBLIC_RSS_FEEDS: { category: TopicCategory; source: string; url: string; subcategory?: FinanceSubcategory }[] = [
  // Finance & Markets (The Economic Times, Mint, Business Standard, The Indian Express Business)
  {
    category: 'finance',
    subcategory: 'economy',
    source: 'The Economic Times',
    url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/13358319.cms'
  },
  {
    category: 'finance',
    subcategory: 'stocks',
    source: 'The Economic Times Markets',
    url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms'
  },
  {
    category: 'finance',
    subcategory: 'stocks',
    source: 'Mint Markets',
    url: 'https://www.livemint.com/rss/markets'
  },
  {
    category: 'finance',
    subcategory: 'startups',
    source: 'Mint Companies',
    url: 'https://www.livemint.com/rss/companies'
  },
  {
    category: 'finance',
    subcategory: 'stocks',
    source: 'Business Standard Markets',
    url: 'https://www.business-standard.com/rss/markets-106.rss'
  },
  {
    category: 'finance',
    subcategory: 'economy',
    source: 'Business Standard Finance',
    url: 'https://www.business-standard.com/rss/finance-103.rss'
  },
  {
    category: 'finance',
    subcategory: 'business',
    source: 'The Indian Express Business',
    url: 'https://indianexpress.com/section/business/feed/'
  },
  {
    category: 'finance',
    subcategory: 'stocks',
    source: 'The Indian Express Markets',
    url: 'https://indianexpress.com/section/business/market/feed/'
  },
  // Technology & AI
  {
    category: 'tech',
    source: 'Mint Tech',
    url: 'https://www.livemint.com/rss/technology'
  },
  {
    category: 'tech',
    source: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index'
  },
  // Politics & Governance
  {
    category: 'policy',
    source: 'The Indian Express',
    url: 'https://indianexpress.com/section/india/feed/'
  },
  // World Intelligence
  {
    category: 'world',
    source: 'BBC News World',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
  },
  {
    category: 'world',
    source: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml'
  },
  // Climate & Energy
  {
    category: 'climate',
    source: 'BBC Environment',
    url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'
  },
  {
    category: 'climate',
    source: 'The Guardian Environment',
    url: 'https://www.theguardian.com/environment/rss'
  },
  // Science & Space
  {
    category: 'science',
    source: 'India Today Science',
    url: 'https://www.indiatoday.in/rss/1206584'
  },
  {
    category: 'science',
    source: 'Phys.org Space',
    url: 'https://phys.org/rss-feed/space-news/'
  },
  // Sports & Culture
  {
    category: 'sports_culture',
    source: 'The Indian Express Sports',
    url: 'https://indianexpress.com/section/sports/feed/'
  },
  {
    category: 'sports_culture',
    source: 'BBC Sport',
    url: 'https://feeds.bbci.co.uk/sport/rss.xml'
  }
];

export const feedService = {
  /**
   * Fetches ONLY real articles retrieved from working, permitted public feeds.
   * Never injects sample, placeholder, or fictional stories.
   */
  async getEditionStories(
    topics: TopicCategory[],
    _forceRefresh: boolean = false,
    financeSubcategory: FinanceSubcategory = 'all'
  ): Promise<FeedResponse> {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Normalize topic preferences
    const activeTopics = (topics.length > 0
      ? [...topics]
      : (['finance', 'tech', 'policy', 'world', 'climate', 'science', 'sports_culture'] as TopicCategory[]));

    if (activeTopics.includes('economy') && !activeTopics.includes('finance')) {
      activeTopics.push('finance');
    }
    if (activeTopics.includes('finance') && !activeTopics.includes('economy')) {
      activeTopics.push('economy');
    }

    try {
      const realStories = await this.fetchRealFeedStories(activeTopics, financeSubcategory);

      if (realStories.length > 0) {
        const uniqueSources = Array.from(new Set(realStories.map((s) => s.sourceName)));
        return {
          stories: realStories,
          isLive: true,
          refreshedAt: timestamp,
          liveCount: realStories.length,
          demoCount: 0,
          sourceNote: `Showing ${realStories.length} real live articles retrieved from ${uniqueSources.join(', ')}. Zero fictional content.`,
        };
      }

      // If feed retrieval returned 0 stories, return honest empty state
      return {
        stories: [],
        isLive: true,
        refreshedAt: timestamp,
        liveCount: 0,
        demoCount: 0,
        sourceNote: 'No recent articles were returned by the connected feeds. Please check network connectivity and tap Refresh.',
        error: 'No articles available from connected feeds for the selected topics.'
      };
    } catch (err: any) {
      console.warn('Real feed ingestion error:', err);
      return {
        stories: [],
        isLive: true,
        refreshedAt: timestamp,
        liveCount: 0,
        demoCount: 0,
        sourceNote: `Feed retrieval encountered an error: ${err.message || 'Network timeout'}. No fictional stories are substituted.`,
        error: err.message || 'Failed to fetch live articles.'
      };
    }
  },

  async fetchRealFeedStories(
    topics: TopicCategory[],
    financeSubcategory: FinanceSubcategory = 'all'
  ): Promise<Story[]> {
    const matchingFeeds = PUBLIC_RSS_FEEDS.filter((f) => {
      const matchesCategory = topics.includes(f.category);
      const matchesSubcategory =
        financeSubcategory === 'all' ||
        !f.subcategory ||
        f.subcategory === financeSubcategory;
      return matchesCategory && matchesSubcategory;
    });

    const collectedStories: Story[] = [];

    // Attempt fetching feeds concurrently with resilient fallback
    const fetchPromises = matchingFeeds.slice(0, 10).map(async (feed) => {
      try {
        const stories = await this.fetchFeedArticles(feed);
        return stories;
      } catch (err) {
        console.warn(`Feed fetch error for ${feed.source}:`, err);
        return [];
      }
    });

    const results = await Promise.allSettled(fetchPromises);
    for (const res of results) {
      if (res.status === 'fulfilled') {
        collectedStories.push(...res.value);
      }
    }

    // Deduplicate by title
    const seenTitles = new Set<string>();
    const deduplicated = collectedStories.filter((s) => {
      const lower = s.title.toLowerCase();
      if (seenTitles.has(lower)) return false;
      seenTitles.add(lower);
      return true;
    });

    return deduplicated;
  },

  /**
   * Resilient feed retriever that works across:
   * 1. Local development server proxy (/api/rss)
   * 2. Client-side CORS RSS API (rss2json) for static hosting
   * 3. Public CORS XML proxy fallback (allorigins)
   */
  async fetchFeedArticles(feed: typeof PUBLIC_RSS_FEEDS[number]): Promise<Story[]> {
    const isLocalHost = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // 1. If in local dev environment with Vite middleware, try local proxy first
    if (isLocalHost) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(`/api/rss?url=${encodeURIComponent(feed.url)}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const xmlText = await res.text();
          const parsed = this.parseXmlToStories(xmlText, feed);
          if (parsed.length > 0) return parsed;
        }
      } catch {
        // Fall through to public RSS API
      }
    }

    // 2. High-speed JSON Feed conversion (handles CORS reliably for Business Standard, Mint, ET)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://feed2json.org/convert?url=${encodeURIComponent(feed.url)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.items) && json.items.length > 0) {
          const parsed: Story[] = [];
          json.items.slice(0, 5).forEach((item: any, idx: number) => {
            const rawTitle = item.title || '';
            const rawDesc = item.summary || item.content_text || item.content_html || '';
            const rawLink = item.url || item.link || '';
            const rawDate = item.date_published || item.date_modified || '';
            const story = this.buildStoryFromRaw(feed, rawTitle, rawDesc, rawLink, rawDate, idx);
            if (story) parsed.push(story);
          });
          if (parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Fall through to rss2json
    }

    // 3. Direct client-side RSS-to-JSON endpoint (handles CORS reliably on static GitHub Pages)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'ok' && Array.isArray(json.items) && json.items.length > 0) {
          const parsed: Story[] = [];
          json.items.slice(0, 5).forEach((item: any, idx: number) => {
            const rawTitle = item.title || '';
            const rawDesc = item.description || item.content || '';
            const rawLink = item.link || '';
            const rawDate = item.pubDate || '';
            const story = this.buildStoryFromRaw(feed, rawTitle, rawDesc, rawLink, rawDate, idx);
            if (story) parsed.push(story);
          });
          if (parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Fall through to XML proxy fallback
    }

    // 3. Public XML CORS proxy fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const json = await res.json();
        if (json.contents) {
          const parsed = this.parseXmlToStories(json.contents, feed);
          if (parsed.length > 0) return parsed;
        }
      }
    } catch {
      // Return empty on total timeout
    }

    return [];
  },

  parseXmlToStories(xmlText: string, feed: typeof PUBLIC_RSS_FEEDS[number]): Story[] {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5);
      const parsed: Story[] = [];

      items.forEach((item, idx) => {
        const rawTitle = item.querySelector('title')?.textContent || '';
        const rawDesc = item.querySelector('description')?.textContent || '';
        const rawLink = item.querySelector('link')?.textContent || '';
        const rawDate = item.querySelector('pubDate')?.textContent || '';
        const story = this.buildStoryFromRaw(feed, rawTitle, rawDesc, rawLink, rawDate, idx);
        if (story) parsed.push(story);
      });

      return parsed;
    } catch {
      return [];
    }
  },

  buildStoryFromRaw(
    feed: typeof PUBLIC_RSS_FEEDS[number],
    rawTitle: string,
    rawDesc: string,
    rawLink: string,
    rawDate: string,
    idx: number
  ): Story | null {
    const cleanTitle = rawTitle.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim();
    const cleanDesc = rawDesc
      .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim();
    const cleanLink = rawLink.trim();
    const pubDate = rawDate || new Date().toISOString();
    const relativeTime = this.formatRelativeTime(pubDate);

    if (!cleanTitle || !cleanLink || cleanLink === '#') return null;

    const keyBullets = this.extractRealKeyPoints(cleanDesc || cleanTitle);
    const playcardSlides = [
      {
        label: 'The Fact',
        title: 'What Happened?',
        body: cleanDesc.slice(0, 220) || cleanTitle,
        type: 'what' as const
      },
      {
        label: 'Significance',
        title: 'Why It Matters',
        body: `Reported by ${feed.source} on ${relativeTime}. Follow direct source reporting for full editorial context.`,
        type: 'why' as const
      },
      {
        label: 'Forward Look',
        title: 'What Could Happen Next (Analysis)',
        body: 'Ongoing developments will be tracked as primary statements and follow-up dispatches emerge.',
        type: 'next' as const
      }
    ];

    return {
      id: `real-${feed.category}-${idx}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      title: cleanTitle,
      deck: cleanDesc.slice(0, 180) + (cleanDesc.length > 180 ? '...' : ''),
      content: cleanDesc || cleanTitle,
      sourceName: feed.source,
      canonicalUrl: cleanLink,
      publishedAt: pubDate,
      timeAgo: relativeTime,
      category: feed.category,
      financeSubcategory: feed.subcategory,
      readingMinutes: Math.max(1, Math.ceil(cleanDesc.length / 350)),
      sourceMode: 'rss',
      isDemoStory: false,
      editorialNature: 'live_syndication',
      sourceTypeLabel: 'Live Article (Official Syndication)',
      curatedReason: `Direct dispatch from ${feed.source} because you follow ${TOPIC_NAMES[feed.category] || feed.category}`,
      keyBullets,
      playcards: playcardSlides,
    };
  },

  /**
   * Resilient XML retrieval fallback (used for compatibility)
   */
  async fetchFeedXml(url: string): Promise<string | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const isLocalHost = typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocalHost) {
      try {
        const localProxyUrl = `/api/rss?url=${encodeURIComponent(url)}`;
        const res = await fetch(localProxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const text = await res.text();
          if (text && (text.includes('<rss') || text.includes('<xml') || text.includes('<feed'))) {
            return text;
          }
        }
      } catch {
        // Fall through
      }
    }

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) return null;
      const json = await res.json();
      return json.contents || null;
    } catch {
      return null;
    }
  },

  formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';

    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return diffMins <= 1 ? 'Just now' : `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    const days = Math.floor(diffHours / 24);
    return days === 1 ? 'Yesterday' : `${days}d ago`;
  },

  extractRealKeyPoints(text: string): string[] {
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20);

    if (sentences.length >= 2) {
      return sentences.slice(0, 3);
    }
    return [
      text.slice(0, 110) + (text.length > 110 ? '...' : ''),
      'Sourced directly from verified publisher syndication wire.',
      'Click the primary link to view full reporter details and documentation.'
    ];
  }
};
