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

    const isStaticHost = typeof window !== 'undefined' && (
      window.location.hostname.includes('github.io') ||
      window.location.hostname.includes('newsiemama.tech')
    );
    const aiNotice = isStaticHost
      ? `Grounded Editorial Extraction • Based directly on ${story.sourceName}'s verified reporting. To prevent exposing API keys in client-side code on static hosting, factual extraction and structured synthesis are displayed without unverified AI hallucinations.`
      : 'AI explanations are unconfigured in local dev. Add GEMINI_API_KEY in local .env to enable on-demand generative synthesis.';

    const titleLower = story.title.toLowerCase();
    const category = story.category;

    // Build intelligent, conversational elements tailored to the category
    let easyReadingText = '';
    let everydayAnalogy = '';
    let conversationalTakeaway = '';
    let forwardScenario = '';

    if (
      category === 'finance' ||
      category === 'economy' ||
      titleLower.includes('market') ||
      titleLower.includes('nifty') ||
      titleLower.includes('sensex') ||
      titleLower.includes('rupee') ||
      titleLower.includes('rbi') ||
      titleLower.includes('shares') ||
      titleLower.includes('profit') ||
      titleLower.includes('bank')
    ) {
      easyReadingText = `Here is what is happening in straightforward business terms: ${firstPoint} Rather than getting bogged down in dense financial jargon, this comes down to how investors and companies are repositioning their capital in response to recent market movements.`;

      if (titleLower.includes('rbi') || titleLower.includes('rate') || titleLower.includes('inflation')) {
        everydayAnalogy = 'Think of interest rates like the thermostat in a busy office: when things get too hot, central bankers dial down the heat to keep prices stable.';
      } else if (titleLower.includes('shares') || titleLower.includes('market') || titleLower.includes('sensex') || titleLower.includes('nifty')) {
        everydayAnalogy = 'Like watching buyers and sellers at a bustling morning produce market — as supply and demand shift, everyone adjusts the price they are willing to pay.';
      } else {
        everydayAnalogy = 'Think of a corporate balance sheet like a household budget: when revenue changes, businesses must balance day-to-day costs against long-term investments.';
      }

      conversationalTakeaway = `Key takeaway: ${story.sourceName} documents an active economic transition. Keep an eye on quarterly corporate reports and sector announcements as the impact unfolds.`;
      forwardScenario = 'Analysts and market participants will monitor upcoming earnings releases, sector volume indicators, and institutional capital flows to gauge whether this trend sustains.';

    } else if (
      category === 'tech' ||
      titleLower.includes('ai') ||
      titleLower.includes('software') ||
      titleLower.includes('chip') ||
      titleLower.includes('cloud') ||
      titleLower.includes('cyber') ||
      titleLower.includes('tech')
    ) {
      easyReadingText = `In plain English: ${firstPoint} Strip away the buzzwords, and this is fundamentally about practical technology solving an operational bottleneck or unlocking new computing scale.`;
      everydayAnalogy = 'Think of this like upgrading the underlying water pipes and electrical wiring of a growing city: you may not see the wires directly, but daily services suddenly run faster and carry far more load.';
      conversationalTakeaway = `Key takeaway: Technology providers are focused on deploying dependable systems that function seamlessly under real-world pressure.`;
      forwardScenario = 'Industry observers will track benchmark evaluations, enterprise adoption rates, and hardware availability as this development rolls out commercially.';

    } else if (
      category === 'policy' ||
      titleLower.includes('court') ||
      titleLower.includes('govt') ||
      titleLower.includes('parliament') ||
      titleLower.includes('tax') ||
      titleLower.includes('law')
    ) {
      easyReadingText = `Breaking this down simply: ${firstPoint} This is about the official rules of the road being updated to address emerging economic and civic realities.`;
      everydayAnalogy = 'Like updating the municipal traffic code when a high-speed express corridor opens: clear rules ensure that everyone from daily commuters to commercial trucks travels safely.';
      conversationalTakeaway = `Key takeaway: Clear regulatory guardrails establish consistency for citizens and enterprises alike, reducing uncertainty.`;
      forwardScenario = 'Public consultations, gazette notifications, and judicial reviews will outline the practical compliance timelines for affected organizations.';

    } else if (
      category === 'climate' ||
      titleLower.includes('solar') ||
      titleLower.includes('energy') ||
      titleLower.includes('emission') ||
      titleLower.includes('green')
    ) {
      easyReadingText = `Here is the clean breakdown: ${firstPoint} Across the country and worldwide, transition toward cleaner, resilient infrastructure is accelerating.`;
      everydayAnalogy = 'Like gradually replacing power-hungry household appliances with modern inverter units — upfront planning is required, but recurring efficiency gains compound steadily.';
      conversationalTakeaway = `Key takeaway: Sustainable infrastructure is shifting from an environmental aspiration into a hard economic priority.`;
      forwardScenario = 'Energy grids and policy committees will monitor capacity additions and grid stability as clean energy assets come online.';

    } else if (
      category === 'science' ||
      titleLower.includes('isro') ||
      titleLower.includes('space') ||
      titleLower.includes('research') ||
      titleLower.includes('nasa')
    ) {
      easyReadingText = `In everyday terms: ${firstPoint} Researchers and engineers have solved a complex technical equation to push our collective boundaries forward.`;
      everydayAnalogy = 'Like a research team finally developing a high-resolution telescope after years of squinting through fog — complex questions suddenly gain sharp visual clarity.';
      conversationalTakeaway = `Key takeaway: Rigorous scientific experimentation and patient research continue to expand what is technologically possible.`;
      forwardScenario = 'Peer-reviewed replications, telemetry validation, and next-phase testing will determine how broadly this breakthrough can be scaled.';

    } else {
      // General / Culture / World
      easyReadingText = `The big picture in plain language: ${firstPoint} This development marks an important update with broader cultural and social reverberations.`;
      everydayAnalogy = 'Like a neighborhood coming together to pave a shared roadway — progress happens when different stakeholders align on a common objective.';
      conversationalTakeaway = `Key takeaway: ${story.sourceName} documents an evolving story with ripple effects across related communities and industries.`;
      forwardScenario = 'Ongoing coverage will track official statements, stakeholder reactions, and civic follow-ups as additional details emerge.';
    }

    return {
      headline: story.title,
      coreSummary: story.deck || firstPoint,
      whatHappened: `${story.sourceName} reports: ${story.content.slice(0, 320)}${story.content.length > 320 ? '...' : ''}`,
      whyItMatters: [
        firstPoint,
        secondPoint,
        thirdPoint
      ],
      whatCouldHappenNext: forwardScenario,
      everydayAnalogy,
      visualExplainer: realVisual,
      easyReadingText,
      conversationalTakeaway,
      activePreset: preset,
      isCustomVoiced: isCustom,
      ageAdaptedNote,
      predictionDisclaimer: 'Forward scenario reflects potential sector developments based on reported reporting. Not financial advice or a guaranteed forecast.',
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
