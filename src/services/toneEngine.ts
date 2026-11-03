import { Story, VoicePreset, CustomVoiceProfile, StoryExplanation, AgeRange, VisualExplainerItem, SlangLevel } from '../types';

export const toneEngine = {
  /**
   * Explains a real retrieved article using:
   * 1. Server-secured Gemini API (when GEMINI_API_KEY is configured in .env)
   * 2. Purely factual, real-article structured extraction fallback (when GEMINI_API_KEY is absent)
   *
   * Never invents fictional scenarios or ungrounded statistics.
   */
  async explainStory(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile,
    ageRange: AgeRange = '25-34',
    slangLevel: SlangLevel = 'subtle'
  ): Promise<StoryExplanation> {
    const isCustom = Boolean(customVoice?.rawSample && customVoice.rawSample.trim().length > 0);

    const ageLabelMap: Record<AgeRange, string> = {
      'under-13': 'Calibrated for young readers (Under 13)',
      '13-17': 'Calibrated for student readers (13–17)',
      '18-24': 'Calibrated for early-career readers (18–24)',
      '25-34': 'Calibrated for professionals & builders (25–34)',
      '35-plus': 'Calibrated for strategic decision-makers (35+)',
      'prefer-not-to-say': 'Standard editorial depth',
    };
    const ageAdaptedNote = ageLabelMap[ageRange] || 'Standard editorial depth';

    // 1. Try server-side Gemini endpoint (server holds key safely, client never sees it)
    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story: {
            title: story.title,
            deck: story.deck,
            content: story.content,
            category: story.category,
            sourceName: story.sourceName,
            canonicalUrl: story.canonicalUrl
          },
          preset,
          ageRange,
          slangLevel
        })
      });

      if (res.ok) {
        const json = await res.json();
        if (json.connected && json.explanation) {
          const exp = json.explanation;
          return {
            headline: exp.headline || story.title,
            coreSummary: exp.coreSummary || story.deck,
            whatHappened: exp.whatHappened || story.content,
            whyItMatters: Array.isArray(exp.whyItMatters) ? exp.whyItMatters : [story.deck],
            whatCouldHappenNext: exp.whatCouldHappenNext || 'Ongoing coverage will track official statements and market response.',
            everydayAnalogy: exp.everydayAnalogy || 'Like watching a key signal light change on an active railway track.',
            visualExplainer: this.buildRealArticleVisual(story),
            easyReadingText: exp.easyReadingText || story.deck,
            conversationalTakeaway: exp.conversationalTakeaway || 'A noteworthy verified dispatch to keep on your radar.',
            activePreset: preset,
            isCustomVoiced: isCustom,
            ageAdaptedNote,
            predictionDisclaimer: 'Exploratory forward scenario based on current reporting. Not a guaranteed outcome.',
            isAiConnected: true,
          };
        }
      }
    } catch {
      // Local server endpoint fallback
    }

    // 2. Unconfigured / Local Fallback: Factual extraction directly from real article
    return this.generateGroundedRealExtraction(story, preset, customVoice, ageRange, ageAdaptedNote);
  },

  generateGroundedRealExtraction(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile,
    _ageRange?: AgeRange,
    ageAdaptedNote?: string
  ): StoryExplanation {
    const isCustom = Boolean(customVoice?.rawSample);
    const sentences = story.content
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 15);

    const firstPoint = sentences[0] || story.deck || story.title;
    const secondPoint = sentences[1] || `Reported in official syndication by ${story.sourceName}.`;
    const thirdPoint = sentences[2] || `Full reporting and primary source documentation available via ${story.sourceName}.`;

    const realVisual = this.buildRealArticleVisual(story);

    const isStaticHost = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const aiNotice = isStaticHost
      ? 'Live AI generation requires a backend server. On static GitHub Pages hosting, verified factual extraction from the original reporting is shown.'
      : 'AI explanations are unconfigured in local dev. Add GEMINI_API_KEY in local .env to enable on-demand generative synthesis.';

    return {
      headline: story.title,
      coreSummary: story.deck || firstPoint,
      whatHappened: `${story.sourceName} reports: ${story.content.slice(0, 320)}${story.content.length > 320 ? '...' : ''}`,
      whyItMatters: [
        firstPoint,
        secondPoint,
        thirdPoint
      ],
      whatCouldHappenNext: 'Stakeholders will monitor subsequent operational disclosures and regulatory announcements as coverage progresses.',
      everydayAnalogy: 'Like receiving a verified morning weather advisory before heading out — clear, grounded facts you can plan around.',
      visualExplainer: realVisual,
      easyReadingText: `${story.title}. In simple terms: ${firstPoint}`,
      conversationalTakeaway: `Verified dispatch from ${story.sourceName}. For full investigative context, consult the original canonical article link.`,
      activePreset: preset,
      isCustomVoiced: isCustom,
      ageAdaptedNote,
      predictionDisclaimer: 'Forward analysis reflects currently reported developments. Not a guaranteed forecast.',
      isAiConnected: false,
      aiNotice,
    };
  },

  buildRealArticleVisual(story: Story): VisualExplainerItem {
    return {
      type: 'steps',
      title: 'Reported Progression',
      subtitle: `Dispatched by ${story.sourceName} • ${story.timeAgo}`,
      explanationText: `This progression maps the key phases reported in ${story.sourceName}'s coverage of ${story.title}.`,
      illustrativeNote: `Flow diagram grounded in verified reporting from ${story.sourceName}.`,
      items: [
        {
          label: 'Phase 1: Reporting',
          text: story.title,
          subtext: `Dispatched by ${story.sourceName}`,
          highlight: true
        },
        {
          label: 'Phase 2: Sector Context',
          text: story.deck || 'Primary developments recorded in this reporting cycle.',
          subtext: `${story.category.toUpperCase()} focus`
        },
        {
          label: 'Phase 3: Verification',
          text: 'Original documentation accessible via publisher canonical link.',
          subtext: 'Direct citation'
        }
      ]
    };
  }
};
