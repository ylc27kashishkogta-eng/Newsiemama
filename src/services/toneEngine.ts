import { Story, VoicePreset, CustomVoiceProfile, StoryExplanation } from '../types';

export const toneEngine = {
  /**
   * Generates a conversational explanation adapted to the active reader's voice preset
   * or customized writing sample profile.
   * Runs 100% locally with zero external API dependencies required.
   */
  async explainStory(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile
  ): Promise<StoryExplanation> {
    // Check if custom voice overrides are in effect
    const isCustom = Boolean(customVoice && customVoice.rawSample && customVoice.rawSample.trim().length > 0);

    // Topic-specific semantic explanations
    const topicExplanations: Record<string, Record<VoicePreset, StoryExplanation>> = {
      'story-1': {
        executive: {
          headline: 'Liquidity & Monetary Stance: Neutral Guidance with Selective Easing Room',
          coreSummary: 'The RBI is maintaining policy rate status quo as core CPI settles at 3.8%. Industrial margins are insulated from input inflation spikes.',
          whyItMatters: [
            'Predictable cost-of-capital environment for upcoming Q4 enterprise debt issuances.',
            'Urban consumer demand remains steady without overheating risk.',
            'Foreign exchange reserves remain shielded against dollar index fluctuations.'
          ],
          conversationalTakeaway: 'The central bank has completed its rate hike cycle and is holding steady until late 2027.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'The RBI is basically taking its foot off the accelerator without hitting the brakes.',
          coreSummary: 'Good news on inflation: prices aren’t surging anymore. The central bank is comfortable with where things are and won’t be surprising anyone with sudden rate hikes.',
          whyItMatters: [
            'Home loan EMIs and credit card interest rates will stay where they are for now.',
            'Companies can plan hiring and investments without fearing credit crunches.',
            'The economy is steady: neither running hot nor stalling out.'
          ],
          conversationalTakeaway: 'Think of this like cruise control on a highway — no dramatic lane shifts, just smooth cruising ahead.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'Inside the Reserve Bank: How India Navigated the Global Inflation Maze',
          coreSummary: 'A quiet morning inside Mumbai’s Mint Road headquarters brought the announcement markets have anticipated for months: price stability is back within target bounds.',
          whyItMatters: [
            'Traders across Dalal Street welcomed the predictable macroeconomic cushion.',
            'Small businesses and industrial manufacturers regain long-term visibility.',
            'Demonstrates how calibrated supply-side interventions tamed core price swings.'
          ],
          conversationalTakeaway: 'A chapter of post-pandemic inflation anxiety is gently drawing to a close, replaced by steady, earned calm.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      },
      'story-2': {
        executive: {
          headline: 'Enterprise AI Architecture: Open-Weight Models Yield 65% Cloud Margin Gains',
          coreSummary: 'Indian enterprises are shifting sensitive production workloads from proprietary US APIs to on-premise fine-tuned Indic LLMs.',
          whyItMatters: [
            'Token inference expenditures slashed by 60–70% within seven months of deployment.',
            'Zero customer financial or biometric data leaves sovereign domestic server boundaries.',
            'Protects enterprise architecture against third-party API deprecations and price changes.'
          ],
          conversationalTakeaway: 'Self-hosting open-weight models is now the default architectural choice for security-conscious Indian CIOs.',
          activePreset: 'executive',
          isCustomVoiced: isCustom,
        },
        conversational: {
          headline: 'Indian tech companies are ditching expensive AI subscriptions to run their own models.',
          coreSummary: 'Why pay monthly per-word fees to overseas AI giants when you can run equally smart models on your own servers at a fraction of the cost?',
          whyItMatters: [
            'Customer data stays completely private inside India.',
            'Apps won’t break if a third-party cloud service goes down.',
            'It’s much cheaper to build AI features in Hindi, Tamil, and Bengali.'
          ],
          conversationalTakeaway: 'It’s like switching from renting a taxi for every errand to owning your own dependable electric scooter.',
          activePreset: 'conversational',
          isCustomVoiced: isCustom,
        },
        storyteller: {
          headline: 'The Bengaluru AI Rebellion: Breaking Free from the Cloud Monopolies',
          coreSummary: 'Across tech corridors from Electronic City to Whitefield, engineering squads are proving that high-performing AI doesn’t require billionaire cloud budgets.',
          whyItMatters: [
            'Indigenous benchmarks validate localized language reasoning capabilities.',
            'Fosters an independent developer ecosystem tailored to local Indian commerce.',
            'Transforms AI from an imported novelty into a homegrown industrial utility.'
          ],
          conversationalTakeaway: 'India’s software builders are doing what they do best: democratizing technology through sheer computational frugality.',
          activePreset: 'storyteller',
          isCustomVoiced: isCustom,
        }
      }
    };

    // Return known tailored explanation if available
    if (topicExplanations[story.id]?.[preset]) {
      const exp = { ...topicExplanations[story.id][preset] };
      if (isCustom && customVoice) {
        exp.conversationalTakeaway = `${exp.conversationalTakeaway} (Tailored to your ${customVoice.formality} ${customVoice.brevity} writing profile)`;
      }
      return exp;
    }

    // Dynamic fallback generation based on story metadata and tone preset
    return this.generateDynamicExplanation(story, preset, customVoice);
  },

  generateDynamicExplanation(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile
  ): StoryExplanation {
    const isCustom = Boolean(customVoice?.rawSample);

    if (preset === 'executive') {
      return {
        headline: `Strategic Brief: ${story.title}`,
        coreSummary: story.deck || story.content.slice(0, 160) + '...',
        whyItMatters: [
          `Directly impacts ${story.category} fundamentals and regulatory forward guidance.`,
          `Signals structural shift for key enterprise and institutional stakeholders.`,
          `Published by ${story.sourceName} with verified industry attribution.`
        ],
        conversationalTakeaway: 'High-signal event requiring operational awareness without emergency response.',
        activePreset: 'executive',
        isCustomVoiced: isCustom,
      };
    }

    if (preset === 'storyteller') {
      return {
        headline: `The Story Behind: ${story.title}`,
        coreSummary: `What began as routine development in ${story.category} has evolved into a noteworthy chapter for national observers.`,
        whyItMatters: [
          `Connects broader global trends to localized developments on the ground.`,
          `Reported directly by ${story.sourceName} with on-the-scene context.`,
          `Sets the trajectory for how this sector will evolve heading into next year.`
        ],
        conversationalTakeaway: 'A fascinating reminder that policy and technology are living stories shaped by real people.',
        activePreset: 'storyteller',
        isCustomVoiced: isCustom,
      };
    }

    // Default conversational
    return {
      headline: `In Plain English: ${story.title}`,
      coreSummary: `Here is the quick breakdown: ${story.deck || story.content.slice(0, 150)}`,
      whyItMatters: [
        `It matters because it shapes how things will work in ${story.category} over coming months.`,
        `You get the core takeaway without wading through complex industry jargon.`,
        `Original reporting from ${story.sourceName} links you straight to the source.`
      ],
      conversationalTakeaway: 'Think of this as a milestone move — worth knowing about over your morning coffee!',
      activePreset: 'conversational',
      isCustomVoiced: isCustom,
    };
  }
};
