import { Story, TopicCategory } from '../../types';
import { NewsSourceAdapter } from './NewsSourceAdapter';

/**
 * ApifyAdapter (Exploratory / Deferred Track)
 * 
 * LEGAL & COMPLIANCE GUARDRAILS:
 * 1. Do NOT scrape behind publisher paywalls or bypass subscriber gates.
 * 2. Comply with publisher robots.txt rules and fair-use excerpt limitations.
 * 3. Never store or republish full copyrighted article bodies without licensing.
 * 4. This adapter is reserved as an exploratory integration option. Tonight's MVP
 *    relies on official public RSS syndication and verified snapshot content.
 */
export interface ApifyActorConfig {
  actorId: string;
  apiToken?: string;
  maxItemsPerPublisher: number;
  allowedDomains: string[];
}

export class ApifyNewsAdapter implements NewsSourceAdapter {
  id = 'apify-crawler-adapter';
  name = 'Apify News Scraper (Exploratory)';
  description = 'Automated web scraper using specialized Apify actors (requires paid compute & publisher ToS audit)';
  isPermitted = false; // Flagged false pending formal ToS verification

  private config: ApifyActorConfig;

  constructor(config?: Partial<ApifyActorConfig>) {
    this.config = {
      actorId: config?.actorId || 'apify/web-scraper',
      apiToken: config?.apiToken || '',
      maxItemsPerPublisher: config?.maxItemsPerPublisher || 10,
      allowedDomains: [
        'economictimes.indiatimes.com',
        'indianexpress.com',
        'indiatoday.in',
        'livemint.com',
      ],
    };
  }

  /**
   * Fetches stories via Apify Actor API or webhook endpoint.
   * Currently provides a documented contract and mock response, safeguarding
   * against paid service charges during student project evaluations.
   */
  async fetchStories(topics: TopicCategory[]): Promise<Story[]> {
    console.info(
      `[ApifyNewsAdapter] Evaluation track called for topics: ${topics.join(', ')}. ` +
      `Live actor execution paused pending publisher ToS compliance review.`
    );
    // Returns empty array to allow immediate fallback to permitted RSS or snapshot
    return [];
  }
}
