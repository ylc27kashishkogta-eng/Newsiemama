import { Story, TopicCategory } from '../types';
import { SAMPLE_STORIES } from '../data/sampleStories';

export interface FeedResponse {
  stories: Story[];
  isLive: boolean;
  refreshedAt: string;
  sourceNote: string;
}

const TOPIC_NAMES: Record<TopicCategory, string> = {
  economy: 'Markets & Economy',
  tech: 'Technology & AI',
  policy: 'Policy & Governance',
  world: 'World Intelligence',
  climate: 'Climate & Energy',
};

// Curated public RSS endpoints of reputable publishers with official syndication
const PUBLIC_RSS_FEEDS: { category: TopicCategory; source: string; url: string }[] = [
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
    source: 'India Today Science',
    url: 'https://www.indiatoday.in/rss/1206584'
  }
];

export const feedService = {
  /**
   * Fetches stories tailored to the reader's active topics.
   * Resilient execution: Attempts live RSS via CORS proxy on refresh, immediately falling back
   * to verified, pre-cached snapshot stories if offline or if external endpoints fail.
   */
  async getEditionStories(topics: TopicCategory[], forceRefresh: boolean = false): Promise<FeedResponse> {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // If no topics selected, default to all available categories
    const activeTopics = topics.length > 0 ? topics : (['economy', 'tech', 'policy', 'world', 'climate'] as TopicCategory[]);

    if (forceRefresh) {
      // Simulate live network sync attempt with quick graceful fallback
      try {
        const liveStories = await this.tryFetchLiveRSS(activeTopics);
        if (liveStories.length > 0) {
          // If live stories are fewer than 5, blend with relevant snapshot stories to maintain broadsheet balance
          const matchingSnapshots = SAMPLE_STORIES.filter(
            (s) => activeTopics.includes(s.category) && !liveStories.some((ls) => ls.title === s.title)
          );
          const blended = [...liveStories, ...matchingSnapshots].slice(0, 10);

          return {
            stories: blended,
            isLive: true,
            refreshedAt: timestamp,
            sourceNote: `Live RSS syndication feeds (${liveStories.length} live articles + illustrative demo broadsheet archive)`,
          };
        }
      } catch (err) {
        console.warn('Live RSS sync encountered proxy timeout, falling back to demo snapshot:', err);
      }
    }

    // High-fidelity guaranteed snapshot fallback (100% offline & demo resilient)
    const matchingStories = SAMPLE_STORIES.filter((story) =>
      activeTopics.includes(story.category)
    );

    // If filter produced very few, include all sample stories to maintain broadsheet fullness
    const rawStories = matchingStories.length >= 3 ? matchingStories : SAMPLE_STORIES;
    const finalStories = rawStories.map((s) => ({
      ...s,
      curatedReason: s.curatedReason || `Because you follow ${TOPIC_NAMES[s.category] || s.category}`,
    }));

    return {
      stories: finalStories,
      isLive: false,
      refreshedAt: timestamp,
      sourceNote: 'Demonstration morning broadsheet snapshot (Illustrative scenarios inspired by The Economic Times, Indian Express, Mint, India Today, BBC)',
    };
  },

  async tryFetchLiveRSS(topics: TopicCategory[]): Promise<Story[]> {
    const targetFeeds = PUBLIC_RSS_FEEDS.filter((feed) => topics.includes(feed.category));
    const collected: Story[] = [];

    // Attempt first 2 feeds with short timeout to prevent UI freezes
    for (const feed of targetFeeds.slice(0, 2)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2200);

        // Using standard public CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
        const res = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const data = await res.json();
        if (!data.contents) continue;

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, 'text/xml');
        const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 3);

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
              timeAgo: 'Just now',
              category: feed.category,
              readingMinutes: Math.max(2, Math.ceil(description.length / 400)),
              sourceMode: 'rss',
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
