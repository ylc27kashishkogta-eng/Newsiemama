import { Story } from '../types';
import { getStoryVisualTheme, StoryVisualTheme } from './editorialVisualService';

export interface IllustrationResponse {
  success: boolean;
  configured: boolean;
  type: 'procedural-svg';
  theme: StoryVisualTheme;
  attribution: string;
  disclaimer: string;
}

/**
 * Editorial Visual Service - 100% Automatic, Zero-Cost, Procedural SVG System.
 * Replaces external paid image-generation APIs with native, accessible vector graphics.
 */
export const illustrationService = {
  getVisualTheme(story: Story): StoryVisualTheme {
    return getStoryVisualTheme(story);
  },

  /**
   * Compatibility method for procedural rendering.
   * Resolves immediately with zero network latency, zero costs, and zero quota restrictions.
   */
  async generateIllustration(story: Story): Promise<IllustrationResponse> {
    const theme = getStoryVisualTheme(story);
    return {
      success: true,
      configured: true,
      type: 'procedural-svg',
      theme,
      attribution: 'Template-generated Newsiemama visual (Procedural SVG)',
      disclaimer: 'Procedurally generated with SVG & CSS from reported facts. Not an AI-generated image.'
    };
  }
};

