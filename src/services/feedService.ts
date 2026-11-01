import { Story, TopicCategory, FinanceSubcategory } from '../types';
import { SAMPLE_STORIES } from '../data/sampleStories';

export interface FeedResponse {
  stories: Story[];
  isLive: boolean;
  refreshedAt: string;
  sourceNote: string;
  liveCount: number;
  demoCount: number;
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
const PUBLIC_RSS_FEEDS: { category: TopicCategory; source: string; url: string }[] = [
  {
    category: 'finance',
    source: 'The Economic Times',
    url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/13358319.cms'
  },
  {
    category: 'economy',
    source: 'The Economic Times',
    url: 'https://economictimes.indiatimes.com/news/economy/policy/rssfeeds/13358319.cms'
  },
  {
    category: 'tech',
    source: 'Mint Tech',
    url: 'https://www.livemint.com/rss/technology'
  },
  {
    category: 'policy',
    source: 'The Indian Express',
    url: 'https://indianexpress.com/section/india/feed/'
  },
  {
    category: 'world',
    source: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml'
  },
  {
    category: 'climate',
    source: 'BBC Climate',
    url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml'
  },
  {
    category: 'science',
    source: 'India Today Science',
    url: 'https://www.indiatoday.in/rss/1206584'
  },
  {
    category: 'sports_culture',
    source: 'The Indian Express Sports',
    url: 'https://indianexpress.com/section/sports/feed/'
  }
];

export const feedService = {
  /**
   * Fetches stories tailored to the reader's active topics and optional finance subcategory.
   * Resilient execution: Attempts live RSS via CORS proxy on refresh, immediately falling back
   * to verified, pre-cached snapshot stories if offline or if external endpoints fail.
   */
  async getEditionStories(
    topics: TopicCategory[],
    forceRefresh: boolean = false,
    financeSubcategory: FinanceSubcategory = 'all'
  ): Promise<FeedResponse> {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Normalize topics: if legacy 'economy' is present, also treat as 'finance' and vice-versa
    const activeTopics = (topics.length > 0 ? [...topics] : (['finance', 'tech', 'policy', 'world', 'climate', 'science', 'sports_culture'] as TopicCategory[]));
    if (activeTopics.includes('economy') && !activeTopics.includes('finance')) {
      activeTopics.push('finance');
    }
    if (activeTopics.includes('finance') && !activeTopics.includes('economy')) {
      activeTopics.push('economy');
    }

    if (forceRefresh) {
      // Simulate live network sync attempt with quick graceful fallback
      try {
        const liveStories = await this.tryFetchLiveRSS(activeTopics);
        if (liveStories.length > 0) {
          // Filter live stories to today or yesterday if possible
          const filteredLive = this.filterRecentStories(liveStories);
          const livePool = filteredLive.length > 0 ? filteredLive : liveStories;

          // Blend with relevant snapshot stories to maintain broadsheet balance (10-12 target stories)
          const matchingSnapshots = SAMPLE_STORIES.filter((s) => {
            const matchesTopic = activeTopics.includes(s.category);
            const matchesFinance = financeSubcategory === 'all' || s.financeSubcategory === financeSubcategory || !s.financeSubcategory;
            const notDuplicate = !livePool.some((ls) => ls.title.toLowerCase() === s.title.toLowerCase());
            return matchesTopic && matchesFinance && notDuplicate;
          });

          const blended = [...livePool, ...matchingSnapshots].slice(0, 12);
          const actualLiveCount = blended.filter((s) => s.sourceMode === 'rss').length;
          const actualDemoCount = blended.filter((s) => s.sourceMode === 'snapshot').length;

          return {
            stories: blended,
            isLive: true,
            refreshedAt: timestamp,
            liveCount: actualLiveCount,
            demoCount: actualDemoCount,
            sourceNote: `Showing ${actualLiveCount} live RSS stories • ${actualDemoCount} illustrative demo scenarios for full section depth.`,
          };
        }
      } catch (err) {
        console.warn('Live RSS sync encountered proxy timeout, falling back to demo snapshot:', err);
      }
    }

    // High-fidelity guaranteed snapshot fallback (100% offline & demo resilient)
    const matchingStories = SAMPLE_STORIES.filter((story) => {
      const matchesTopic = activeTopics.includes(story.category);
      const matchesFinance = financeSubcategory === 'all' || story.financeSubcategory === financeSubcategory || !story.financeSubcategory;
      return matchesTopic && matchesFinance;
    });

    const rawStories = matchingStories.length >= 3 ? matchingStories : SAMPLE_STORIES;
    const finalStories = rawStories.map((s) => ({
      ...s,
      curatedReason: s.curatedReason || `Because you follow ${TOPIC_NAMES[s.category] || s.category}`,
    }));

    return {
      stories: finalStories,
      isLive: false,
      refreshedAt: timestamp,
      liveCount: 0,
      demoCount: finalStories.length,
      sourceNote: `Demonstration edition (${finalStories.length} illustrative stories covering Finance, Tech, Policy, World, Climate, Science, Culture).`,
    };
  },

  filterRecentStories(stories: Story[]): Story[] {
    const now = Date.now();
    const twoDaysMs = 48 * 60 * 60 * 1000;
    return stories.filter((s) => {
      const pubTime = new Date(s.publishedAt).getTime();
      return !isNaN(pubTime) && (now - pubTime) <= twoDaysMs;
    });
  },

  async tryFetchLiveRSS(topics: TopicCategory[]): Promise<Story[]> {
    const targetFeeds = PUBLIC_RSS_FEEDS.filter((feed) => topics.includes(feed.category));
    const collected: Story[] = [];

    // Attempt first 3 feeds with short timeout to prevent UI freezes
    for (const feed of targetFeeds.slice(0, 3)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2400);

        // Using standard public CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const data = await res.json();
        if (!data.contents) continue;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 4);

        items.forEach((item, idx) => {
          const title = item.querySelector('title')?.textContent?.trim() || '';
          const description = item.querySelector('description')?.textContent?.replace(/<[^>]+>/g, '').trim() || '';
          const link = item.querySelector('link')?.textContent?.trim() || '#';
          const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();

          if (title) {
            collected.push({
              id: `rss-${feed.category}-${idx}-${Date.now()}`,
              title,
              deck: description.slice(0, 160) + (description.length > 160 ? '...' : ''),
              content: description || title,
              sourceName: feed.source,
              canonicalUrl: link,
              publishedAt: pubDate,
              timeAgo: 'Recent Wire',
              category: feed.category,
              readingMinutes: Math.max(2, Math.ceil(description.length / 400)),
              sourceMode: 'rss',
              isDemoStory: false,
              editorialNature: 'live_syndication',
              sourceTypeLabel: 'Live RSS Feed',
              curatedReason: `Live dispatch from ${feed.source} because you follow ${TOPIC_NAMES[feed.category] || feed.category}`,
              keyBullets: [
                description.slice(0, 90) + '...',
                `Reported live via ${feed.source} syndication wire.`,
                `Full context and source available via canonical article link.`
              ],
              playcards: [
                { label: 'Live Wire', title: 'What Happened?', body: description.slice(0, 200) || title, type: 'what' },
                { label: 'Context', title: 'Why It Matters', body: `Direct live syndication from ${feed.source} covering recent events in ${TOPIC_NAMES[feed.category] || feed.category}.`, type: 'why' },
                { label: 'Ongoing', title: 'What Could Happen Next (Analysis)', body: 'Follow the original reporting source for real-time live updates as official statements arrive.', type: 'next' }
              ]
            });
          }
        });
      } catch {
        // Individual feed errors fall through cleanly
      }
    }

    return collected;
  }
};
