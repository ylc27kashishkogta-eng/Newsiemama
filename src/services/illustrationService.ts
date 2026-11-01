import { Story } from '../types';

export interface IllustrationResponse {
  success: boolean;
  configured: boolean;
  imageUrl?: string;
  promptUsed?: string;
  attribution?: string;
  disclaimer?: string;
  message?: string;
  setupInstructions?: string[];
  error?: string;
}

// In-memory cache keyed by story ID to avoid redundant generation calls
const illustrationCache = new Map<string, IllustrationResponse>();

export const illustrationService = {
  /**
   * Check if a cached illustration already exists for this story.
   */
  getCached(storyId: string): IllustrationResponse | undefined {
    return illustrationCache.get(storyId);
  },

  /**
   * Explicitly generate an editorial illustration on demand.
   * Calls the server-side proxy which holds the provider key securely.
   */
  async generateIllustration(story: {
    id: string;
    title: string;
    deck?: string;
    content?: string;
    category?: string;
    sourceName?: string;
  }): Promise<IllustrationResponse> {
    const cached = illustrationCache.get(story.id);
    if (cached && cached.success) {
      return cached;
    }

    try {
      const res = await fetch('/api/gemini/illustrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: {
            id: story.id,
            title: story.title,
            deck: story.deck,
            content: story.content,
            category: story.category,
            sourceName: story.sourceName
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        return {
          success: false,
          configured: true,
          error: `Server responded with status ${res.status}: ${errorText}`
        };
      }

      const result: IllustrationResponse = await res.json();
      if (result.success && result.imageUrl) {
        illustrationCache.set(story.id, result);
      }
      return result;
    } catch (err: any) {
      return {
        success: false,
        configured: false,
        error: err?.message || 'Network error reaching illustration service.'
      };
    }
  }
};
