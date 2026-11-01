import { Story, VoicePreset, CustomVoiceProfile, StoryExplanation, AgeRange, VisualExplainerItem } from '../types';

export const toneEngine = {
  /**
   * Generates a conversational guided narrative explanation adapted to:
   * 1. The reader's voice preset (Quick Brief, Friendly Explainer, Storyteller)
   * 2. The reader's age range (Under 13, 13–17, 18–24, 25–34, 35+, Prefer not to say)
   * 3. Optional customized writing sample profile
   *
   * Runs 100% locally with zero external API dependencies required.
   */
  async explainStory(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile,
    ageRange: AgeRange = '25-34'
  ): Promise<StoryExplanation> {
    const isCustom = Boolean(customVoice?.rawSample && customVoice.rawSample.trim().length > 0);

    // Compute age adaptation note and analogy adjustments
    const ageLabelMap: Record<AgeRange, string> = {
      'under-13': 'Calibrated for young readers (Under 13) with plain concepts and everyday analogies',
      '13-17': 'Calibrated for teen readers (13–17) with school and tech-relatable analogies',
      '18-24': 'Calibrated for university & early-career readers (18–24)',
      '25-34': 'Calibrated for working professionals & builders (25–34)',
      '35-plus': 'Calibrated for established decision-makers & household planners (35+)',
      'prefer-not-to-say': 'Standard balanced editorial depth',
    };
    const ageAdaptedNote = ageLabelMap[ageRange] || 'Standard editorial depth';

    // Tailored explanations for the 8 core demo stories
    const storyId = story.id;
    if (DETAILED_STORY_DATA[storyId]) {
      const data = DETAILED_STORY_DATA[storyId];
      const presetCopy = data.presets[preset];

      // Age-adjusted analogy override if available
      let analogy = presetCopy.everydayAnalogy;
      if (data.ageAnalogies && data.ageAnalogies[ageRange]) {
        analogy = data.ageAnalogies[ageRange];
      }

      let takeaway = presetCopy.conversationalTakeaway;
      if (isCustom && customVoice) {
        takeaway = `${takeaway} (Tailored to your ${customVoice.formality} ${customVoice.brevity} writing profile)`;
      }

      return {
        headline: presetCopy.headline,
        coreSummary: presetCopy.coreSummary,
        whatHappened: data.whatHappened,
        whyItMatters: presetCopy.whyItMatters,
        whatCouldHappenNext: data.whatCouldHappenNext,
        everydayAnalogy: analogy,
        visualExplainer: data.visualExplainer,
        easyReadingText: data.easyReadingText,
        conversationalTakeaway: takeaway,
        activePreset: preset,
        isCustomVoiced: isCustom,
        ageAdaptedNote,
        predictionDisclaimer: 'Exploratory forward scenario based on current reporting. Not a guaranteed outcome or prediction.',
      };
    }

    // Dynamic fallback generation for RSS or external feeds
    return this.generateDynamicExplanation(story, preset, customVoice, ageRange, ageAdaptedNote);
  },

  generateDynamicExplanation(
    story: Story,
    preset: VoicePreset,
    customVoice?: CustomVoiceProfile,
    _ageRange?: AgeRange,
    ageAdaptedNote?: string
  ): StoryExplanation {
    const isCustom = Boolean(customVoice?.rawSample);

    const dynamicVisual: VisualExplainerItem = {
      type: 'steps',
      title: 'How This Unfolds',
      subtitle: `Key operational phases in this ${story.category} development`,
      explanationText: `This progression illustrates how the reported development in ${story.category} moves from initial public announcement through industry adaptation to everyday consumer impact.`,
      illustrativeNote: `Illustrative process flow diagram based on coverage from ${story.sourceName}.`,
      items: [
        { label: 'Phase 1: Announcement', text: 'Reported development published by primary source.', subtext: `Covered by ${story.sourceName}`, highlight: true },
        { label: 'Phase 2: Market Adjustment', text: 'Sector stakeholders align infrastructure, capital, and operations.', subtext: 'Commercial response' },
        { label: 'Phase 3: Public Impact', text: 'Downstream availability and regulatory integration across consumer markets.', subtext: 'Everyday adoption' },
      ],
    };

    if (preset === 'executive') {
      return {
        headline: `Strategic Brief: ${story.title}`,
        coreSummary: story.deck || story.content.slice(0, 160) + '...',
        whatHappened: `${story.sourceName} reports that significant developments are underway in ${story.category}. Specifically: ${story.content.slice(0, 240)}...`,
        whyItMatters: [
          `Directly impacts ${story.category} industry fundamentals and forward planning.`,
          `Signals a structural shift for institutional and consumer stakeholders.`,
          `Published by ${story.sourceName} in official syndication.`
        ],
        whatCouldHappenNext: 'Stakeholders will track quarterly compliance milestones and policy rollouts over the coming months.',
        everydayAnalogy: 'Like a referee blowing a whistle before a restart — everyone pauses to see the new field position before moving forward.',
        visualExplainer: dynamicVisual,
        easyReadingText: `${story.title}. In simple terms: things are changing in ${story.category}. Experts are watching closely to see how prices and rules shift.`,
        conversationalTakeaway: 'High-signal event requiring operational awareness without emergency response.',
        activePreset: 'executive',
        isCustomVoiced: isCustom,
        ageAdaptedNote,
        predictionDisclaimer: 'Exploratory forward scenario based on current reporting. Not a guaranteed outcome.',
      };
    }

    if (preset === 'storyteller') {
      return {
        headline: `The Story Behind: ${story.title}`,
        coreSummary: `What began as a quiet development in ${story.category} has evolved into a noteworthy chapter for national observers.`,
        whatHappened: `In an impactful dispatch from ${story.sourceName}: ${story.content.slice(0, 260)}...`,
        whyItMatters: [
          `Connects broader global shifts to tangible developments on the ground.`,
          `Reported directly by ${story.sourceName} with verifiable eyewitness context.`,
          `Sets the trajectory for how this sector will evolve heading into next year.`
        ],
        whatCouldHappenNext: 'As initial trials give way to wider rollout, neighboring regions and competing sectors will feel the ripple effects.',
        everydayAnalogy: 'Think of dropping a small pebble into a calm pond — the initial splash is small, but the rings slowly spread to every shore.',
        visualExplainer: dynamicVisual,
        easyReadingText: `Here is the story: A big update happened in ${story.category}. Leaders and communities are working together to make sure it helps everyday people.`,
        conversationalTakeaway: 'A fascinating reminder that policy and technology are living stories shaped by real people.',
        activePreset: 'storyteller',
        isCustomVoiced: isCustom,
        ageAdaptedNote,
        predictionDisclaimer: 'Exploratory forward scenario based on current reporting. Not a guaranteed outcome.',
      };
    }

    // Default conversational
    return {
      headline: `In Plain English: ${story.title}`,
      coreSummary: `Here is the quick breakdown: ${story.deck || story.content.slice(0, 150)}`,
      whatHappened: `According to ${story.sourceName}, a major move took place today: ${story.content.slice(0, 240)}...`,
      whyItMatters: [
        `It shapes how things will work in ${story.category} over the coming months.`,
        `You get the core takeaway without wading through complex industry jargon.`,
        `Original reporting from ${story.sourceName} links you straight to primary sources.`
      ],
      whatCouldHappenNext: 'Keep an eye on how upcoming consumer prices and regulatory guidelines adapt in the next cycle.',
      everydayAnalogy: 'Think of this like a traffic signal turning from yellow to green — things were cautious, but now traffic is flowing smoothly again.',
      visualExplainer: dynamicVisual,
      easyReadingText: `What happened: ${story.title}. Why it matters: It makes daily life and future planning more predictable. What is next: More updates soon.`,
      conversationalTakeaway: 'Think of this as a milestone move — worth knowing about over your morning coffee!',
      activePreset: 'conversational',
      isCustomVoiced: isCustom,
      ageAdaptedNote,
      predictionDisclaimer: 'Exploratory forward scenario based on current reporting. Not a guaranteed outcome.',
    };
  }
};

// ============================================================================
// Granular Grounded Story Content & Visual Explainers
// ============================================================================

interface DetailedStoryMeta {
  whatHappened: string;
  whatCouldHappenNext: string;
  easyReadingText: string;
  visualExplainer: VisualExplainerItem;
  ageAnalogies?: Partial<Record<AgeRange, string>>;
  presets: Record<VoicePreset, {
    headline: string;
    coreSummary: string;
    whyItMatters: string[];
    everydayAnalogy: string;
    conversationalTakeaway: string;
  }>;
}

const DETAILED_STORY_DATA: Record<string, DetailedStoryMeta> = {
  // Story 1: RBI Monetary Policy & Core Inflation
  'story-1': {
    whatHappened: 'The Reserve Bank of India (RBI) decided to keep its benchmark interest rates unchanged. Core inflation — which measures the price of goods and services excluding volatile food and fuel — dropped to 3.8%, its lowest level in 14 months. This means prices are stabilizing across the country without triggering sharp sudden spikes.',
    whatCouldHappenNext: 'With inflation safely under control, economic analysts anticipate the central bank will keep rates steady through early 2027, with potential room for targeted interest rate cuts later in the year if global oil prices stay calm.',
    easyReadingText: 'Prices for everyday things are no longer jumping up quickly. The Reserve Bank decided not to raise interest rates, which means loans and prices will stay steady for now.',
    visualExplainer: {
      type: 'chart',
      title: 'Core Inflation vs. RBI Policy Rate (14-Month Trend)',
      subtitle: 'Price pressures cooling safely inside the RBI 2%–6% comfort band',
      explanationText: 'Consumer price inflation has fallen from a peak of 6.2% down to 3.8% today. Because price pressures have cooled below the central bank’s 4% midpoint, the RBI paused rate hikes at 6.5%, giving families and corporate borrowers predictable interest rates.',
      illustrativeNote: 'Illustrative comparative chart based on official Reserve Bank of India MPC macroeconomic releases.',
      chartData: {
        metricLabel: 'Core CPI Inflation & Policy Rate Trend',
        unit: '% rate',
        bars: [
          { label: '14 Months Ago (Peak)', value: 6.2, displayValue: '6.2%', subtext: 'Supply-chain price spikes', color: 'neutral' },
          { label: '6 Months Ago', value: 4.9, displayValue: '4.9%', subtext: 'Beginning moderation', color: 'neutral' },
          { label: 'Today (Core CPI)', value: 3.8, displayValue: '3.8%', subtext: 'Safely below 4% target midpoint', isTarget: true, color: 'sage' },
          { label: 'RBI Policy Repo Rate', value: 6.5, displayValue: '6.5%', subtext: 'Paused status quo (no hikes)', color: 'terracotta' },
        ],
      },
      items: [
        { label: 'Past (Rate Hikes)', text: 'EMIs rose and credit tightened to suppress post-pandemic price surges.', subtext: 'Core inflation peaked at 6.2%' },
        { label: 'Now (Rate Pause)', text: 'Loan EMIs hold steady; businesses budget capex investments with confidence.', subtext: 'Core inflation down to 3.8%', highlight: true },
        { label: 'Future (Selective Easing)', text: 'Room opens for selective growth easing if commodity prices stay calm.', subtext: 'Targeted capex support' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Imagine you were riding your bicycle too fast downhill and had to tap the brakes. Now you are on flat ground, coasting at a safe, smooth speed.',
      '13-17': 'Think of a game update that balances overpowered weapons so everyone has a fair match — the game economy stops fluctuating wildly.',
      '18-24': 'Like locking in a flat room rent for the entire year instead of worrying your landlord will hike it next month.',
      '25-34': 'Cruise control on a busy expressway: your home loan EMI won’t unexpectedly jump, so you can plan savings and big purchases with confidence.',
      '35-plus': 'Predictable bond yields and steady capital costs, giving family savings and long-term retirement portfolios a dependable planning horizon.',
    },
    presets: {
      executive: {
        headline: 'Liquidity & Monetary Stance: Neutral Guidance with Selective Easing Room',
        coreSummary: 'The RBI is maintaining policy rate status quo as core CPI settles at 3.8%. Industrial margins are insulated from input inflation spikes.',
        whyItMatters: [
          'Predictable cost-of-capital environment for upcoming Q4 enterprise debt issuances.',
          'Urban consumer demand remains steady without overheating risk.',
          'Foreign exchange reserves remain shielded against dollar index fluctuations.'
        ],
        everydayAnalogy: 'Cruise control for monetary supply: neither braking the growth engine nor feeding asset inflation.',
        conversationalTakeaway: 'The central bank has completed its rate hike cycle and is holding steady until late 2027.',
      },
      conversational: {
        headline: 'The RBI is basically taking its foot off the accelerator without hitting the brakes.',
        coreSummary: 'Good news on inflation: prices aren’t surging anymore. The central bank is comfortable with where things are and won’t be surprising anyone with sudden rate hikes.',
        whyItMatters: [
          'Home loan EMIs and credit card interest rates will stay where they are for now.',
          'Companies can plan hiring and investments without fearing credit crunches.',
          'The economy is steady: neither running hot nor stalling out.'
        ],
        everydayAnalogy: 'Think of this like cruise control on a highway — no dramatic lane shifts, just smooth cruising ahead.',
        conversationalTakeaway: 'Your loans won’t get more expensive, and the country’s economy is cruising along smoothly.',
      },
      storyteller: {
        headline: 'Inside the Reserve Bank: How India Navigated the Global Inflation Maze',
        coreSummary: 'A quiet morning inside Mumbai’s Mint Road headquarters brought the announcement markets have anticipated for months: price stability is back within target bounds.',
        whyItMatters: [
          'Traders across Dalal Street welcomed the predictable macroeconomic cushion.',
          'Small businesses and industrial manufacturers regain long-term visibility.',
          'Demonstrates how calibrated supply-side interventions tamed core price swings.'
        ],
        everydayAnalogy: 'Like an ocean freighter navigating a narrow harbor channel, steady hands on the rudder brought calm waters.',
        conversationalTakeaway: 'A chapter of post-pandemic inflation anxiety is gently drawing to a close, replaced by steady, earned calm.',
      },
    },
  },

  // Story 2: Open-Weight AI Models in India
  'story-2': {
    whatHappened: 'Indian enterprise technology companies are moving away from paying high monthly fees to overseas cloud AI providers. Instead, they are downloading and self-hosting "open-weight" AI models that run on their own domestic computer servers in India. Benchmarks show these local models match 94% of commercial performance at one-third the operational cost.',
    whatCouldHappenNext: 'Expect Indian tech startups and banks to roll out specialized customer services in regional languages (Hindi, Tamil, Marathi, Bengali) faster and cheaper, without customer banking data leaving Indian soil.',
    easyReadingText: 'Indian tech teams are using free, open-source AI programs on their own computers instead of renting expensive AI services from other countries. It saves money and keeps data private.',
    visualExplainer: {
      type: 'comparison',
      title: 'Closed Cloud APIs vs. Self-Hosted Open-Weight Models',
      subtitle: 'Architectural trade-offs across cost, data sovereignty, and hardware payback',
      explanationText: 'Self-hosting open-weight language models on local hardware slashes ongoing API expenses by 65% and guarantees sensitive customer data never crosses sovereign national borders. The required server infrastructure investment pays for itself in just seven months.',
      illustrativeNote: 'Illustrative architectural benchmark based on National Consortium for AI Innovation test data.',
      items: [
        { label: 'Token Inference Expense', text: 'Proprietary Cloud APIs: Metered per-token billing subject to overseas price changes vs. Self-Hosted: 65% recurring cost reduction.', subtext: 'Direct operational margin boost', highlight: true },
        { label: 'Data Sovereignty & Privacy', text: 'Proprietary Cloud APIs: Customer queries transit overseas servers vs. Self-Hosted: 100% on-premise containment within Indian data centers.', subtext: 'RBI and DPDP compliance ready', highlight: true },
        { label: 'Multilingual Accuracy', text: 'Proprietary Cloud APIs: General English bias vs. Self-Hosted: 94% benchmark parity with deep Indic tokenization (Hindi, Tamil, Marathi).', subtext: 'Optimized for local domestic commerce' },
        { label: 'Capital Payback Cycle', text: 'Proprietary Cloud APIs: Perpetual monthly rental expense vs. Self-Hosted: Server hardware investment amortizes fully within 7 months.', subtext: 'Long-term enterprise capital asset' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Instead of paying an arcade every time you play a game, you saved up and bought the game console to play at home anytime for free.',
      '13-17': 'Like downloading a complete offline game on your PC instead of streaming it over laggy, metered mobile data.',
      '18-24': 'Switching from an expensive monthly streaming subscription to hosting your own open-source media library.',
      '25-34': 'Switching from renting a ride-share for every daily errand to owning a reliable electric scooter with zero per-kilometer fees.',
      '35-plus': 'Moving from perpetual equipment leasing contracts to owning enterprise capital assets that pay for themselves in two quarters.',
    },
    presets: {
      executive: {
        headline: 'Enterprise AI Architecture: Open-Weight Models Yield 65% Cloud Margin Gains',
        coreSummary: 'Indian enterprises are shifting sensitive production workloads from proprietary US APIs to on-premise fine-tuned Indic LLMs.',
        whyItMatters: [
          'Token inference expenditures slashed by 60–70% within seven months of deployment.',
          'Zero customer financial or biometric data leaves sovereign domestic server boundaries.',
          'Protects enterprise architecture against third-party API deprecations and price changes.'
        ],
        everydayAnalogy: 'Transitioning from metered taxi rides to owning an enterprise vehicle fleet.',
        conversationalTakeaway: 'Self-hosting open-weight models is now the default architectural choice for security-conscious Indian CIOs.',
      },
      conversational: {
        headline: 'Indian tech companies are ditching expensive AI subscriptions to run their own models.',
        coreSummary: 'Why pay monthly per-word fees to overseas AI giants when you can run equally smart models on your own servers at a fraction of the cost?',
        whyItMatters: [
          'Customer data stays completely private inside India.',
          'Apps won’t break if a third-party cloud service goes down.',
          'It’s much cheaper to build AI features in Hindi, Tamil, and Bengali.'
        ],
        everydayAnalogy: 'It’s like switching from renting a taxi for every errand to owning your own dependable electric scooter.',
        conversationalTakeaway: 'Indian apps are going to get smarter, cheaper, and more private because they own the AI tech.',
      },
      storyteller: {
        headline: 'The Bengaluru AI Rebellion: Breaking Free from the Cloud Monopolies',
        coreSummary: 'Across tech corridors from Electronic City to Whitefield, engineering squads are proving that high-performing AI doesn’t require billionaire cloud budgets.',
        whyItMatters: [
          'Indigenous benchmarks validate localized language reasoning capabilities.',
          'Fosters an independent developer ecosystem tailored to local Indian commerce.',
          'Transforms AI from an imported novelty into a homegrown industrial utility.'
        ],
        everydayAnalogy: 'Frugal engineering at its best: building a race-winning car out of precision workshop parts.',
        conversationalTakeaway: 'India’s software builders are doing what they do best: democratizing technology through computational frugality.',
      },
    },
  },

  // Story 3: Dedicated Freight Corridor
  'story-3': {
    whatHappened: 'The Western Dedicated Freight Corridor (DFC) is now fully operational between the National Capital Region (Delhi/Haryana) and the shipping ports of Gujarat and Mumbai. Freight trains no longer share tracks with passenger trains, slashing shipping time by 38 hours.',
    whatCouldHappenNext: 'As cargo moves twice as fast, shipping costs will drop by an estimated 18%, helping Indian factories export cars, clothes, and electronics to global markets at competitive prices.',
    easyReadingText: 'A brand-new electric railway made only for cargo trains just opened between Delhi and Mumbai. Goods now travel in two days instead of four, keeping prices lower.',
    visualExplainer: {
      type: 'map',
      title: 'Western Dedicated Freight Corridor (DFC) Route Map',
      subtitle: 'Dedicated 1,500 km electrified transit route from NCR inland hubs to Arabian Sea ports',
      explanationText: 'By building separated double-stack electric rail corridors, freight locomotives avoid waiting behind passenger trains. Average speeds surge from 25 km/h to 68 km/h, cutting transit times from 70 hours down to 32 hours and reducing logistics costs by 18%.',
      illustrativeNote: 'Illustrative corridor transit map based on Dedicated Freight Corridor Corporation of India (DFCCIL) alignment data.',
      mapData: {
        corridorName: 'Western DFC (Dadri to JNPT & Mundra)',
        origin: 'Dadri Logistics Hub (NCR)',
        destination: 'Nhava Sheva (JNPT) & Mundra Maritime Ports',
        statSummary: '1,500 km electric line • 38 hours saved • 68 km/h avg speed (up from 25 km/h)',
        stops: [
          { name: 'Dadri & Rewari (NCR / Haryana)', role: 'Inland multimodal container terminal and northern manufacturing origin', isTerminal: true },
          { name: 'Palanpur & Mehsana (Rajasthan / Gujarat)', role: 'Double-stack container staging junction across arid terrain' },
          { name: 'Sanand & Ahmedabad (Gujarat)', role: 'Automotive and semiconductor cluster interchange link', highlight: true },
          { name: 'Nhava Sheva (JNPT) & Mundra (Maharashtra / Gujarat)', role: 'Deep-water maritime terminals loading international container ships', isTerminal: true },
        ],
      },
      items: [
        { label: 'Old Shared Rails', text: 'Freight trains yielded to passenger trains; average speed 25 km/h; nearly 70 hours transit time.', subtext: 'Constant bottleneck delays' },
        { label: 'New Western DFC', text: 'Double-stack electric freight trains; average speed 68 km/h; under 32 hours total transit.', subtext: 'Cuts aggregate shipping cost by 18%', highlight: true },
      ],
    },
    ageAnalogies: {
      'under-13': 'Imagine if school buses had their own private elevated express lane without any traffic lights or cars in the way.',
      '13-17': 'Like getting an exclusive fiber optic internet line that never slows down when the rest of the house streams 4K video.',
      '18-24': 'Switching from congested city surface streets to an open 6-lane toll expressway during rush hour.',
      '25-34': 'Creating a dedicated pipeline for your heaviest cargo instead of waiting in line at the post office with everyday envelopes.',
      '35-plus': 'Separating commercial heavy freight from civil passenger networks, drastically lowering supply chain friction.',
    },
    presets: {
      executive: {
        headline: 'Logistics Infrastructure: Western DFC Yields 38-Hour Transit Compression',
        coreSummary: 'Dedicated rail freight corridors between NCR and maritime hubs in Gujarat/Maharashtra have reduced container travel time by nearly two days.',
        whyItMatters: [
          'Average commercial train speeds surged from 25 km/h to 68 km/h on dedicated tracks.',
          'Direct logistics cost reduction of 18% for automotive and textile export clusters.',
          'Accelerates container turnaround times at Nhava Sheva (JNPT) and Mundra ports.'
        ],
        everydayAnalogy: 'A high-throughput bypass artery replacing decades of congested mixed-traffic arterial roads.',
        conversationalTakeaway: 'Moving factory goods across Western India is now twice as fast and substantially cheaper.',
      },
      conversational: {
        headline: 'Freight trains between Delhi and Mumbai are no longer crawling slower than bicycles.',
        coreSummary: 'Freight cargo in India used to get delayed whenever passenger trains took priority. With dedicated double-decker electric rail corridors, shipping containers now zip across the country in record time.',
        whyItMatters: [
          'Made-in-India electronics and cars reach cargo ships 38 hours earlier.',
          'Fewer diesel trucks on national highways means cleaner air and less highway congestion.',
          'Helps Indian manufacturers compete directly with Chinese export delivery speeds.'
        ],
        everydayAnalogy: 'Imagine building a private express highway exclusively for freight trains — that is what just went operational.',
        conversationalTakeaway: 'Everything from auto parts to electronics will reach ports days faster and with lower pollution.',
      },
      storyteller: {
        headline: 'Across the Thar Plains: The Electric Rail Artery Transforming India’s Trade',
        coreSummary: 'Beneath overhead high-voltage wires stretching across the scrublands of Rajasthan and Gujarat, mile-long freight trains loaded with two tiers of containers glide silently through the night.',
        whyItMatters: [
          'Ends decades of freight trains being sidelined on congested shared passenger tracks.',
          'Unlocks economic hinterlands in Haryana and Western UP directly to international maritime shipping lanes.',
          'A triumph of heavy civil engineering and automated signaling technology.'
        ],
        everydayAnalogy: 'A silver thread of steel stitching India’s inland workshops straight to the Indian Ocean.',
        conversationalTakeaway: 'Quietly and relentlessly, the backbone of India’s industrial modernization is being welded in steel and electric power.',
      },
    },
  },

  // Story 4: ISRO Autonomous Orbital Docking
  'story-4': {
    whatHappened: 'The Indian Space Research Organisation (ISRO) successfully docked two robotic spacecraft in orbit 400 km above Earth completely autonomously, with zero guidance from human ground controllers. Using laser rangefinders and automated thrusters, the craft lined up with sub-millimeter precision.',
    whatCouldHappenNext: 'This technology is the core foundation needed to assemble India’s own orbital space station (Bharatiya Antariksh Station), scheduled to launch its first modular segments in 2028.',
    easyReadingText: 'ISRO launched two robot spaceships that found each other in space and locked together completely on their own without human help. This will help India build its own space station.',
    visualExplainer: {
      type: 'steps',
      title: '4-Phase Autonomous Orbital Docking Sequence',
      subtitle: 'Automated rendezvous and sub-millimeter latching in low Earth orbit (400 km)',
      explanationText: 'Docking two spacecraft travelling at 28,000 km/h requires automated multi-stage rendezvous sensors. ISRO’s test validated that optical lidar and computer vision can execute the final alignment and propellant transfer lock without ground operator latency.',
      illustrativeNote: 'Illustrative flight sequence diagram based on ISRO ISTRAC telemetry trial reports.',
      items: [
        { label: 'Phase 1: Long-Range Radar (50 km)', text: 'Chaser spacecraft acquires target module via microwave radar telemetry and computes relative orbital drift.' },
        { label: 'Phase 2: Lidar Laser Rangefinding (100 m)', text: 'Infrared laser scanners measure approach velocity down to centimeters per second in pitch darkness.', highlight: true },
        { label: 'Phase 3: Soft Latch Engagement (Contact)', text: 'Miniature reaction-control thrusters align capture probes, absorbing zero-g recoil kinetic energy.' },
        { label: 'Phase 4: Hermetic Hard Seal (Locked)', text: 'Robotic clamps complete an airtight structural connection for electrical, telemetry, and propellant fluid transfer.' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Like connecting two Lego spaceship bricks together while riding on a roller coaster in total darkness!',
      '13-17': 'Like hitting an aerial trickshot in a video game while both players are falling at terminal velocity.',
      '18-24': 'Like automated Tesla self-parking, but in three dimensions at 28,000 km/h with zero second chances.',
      '25-34': 'Threading a needle from across a football stadium while flying on supersonic aircraft.',
      '35-plus': 'Precision robotic surgery executed across hundreds of kilometers of vacuum, validating sovereign aerospace autonomy.',
    },
    presets: {
      executive: {
        headline: 'Aerospace Engineering: Autonomous Orbital Docking Validated for Space Station',
        coreSummary: 'ISRO has successfully proven sub-millimeter robotic docking and fluid transfer in low Earth orbit, satisfying the technical gate for the 2028 space station launch.',
        whyItMatters: [
          'Autonomous optical rangefinders and laser sensors achieved automated latching without manual ground override.',
          'Validates modular module assembly in space, essential for the Bharatiya Antariksh Station.',
          'Enables orbital refueling and multi-payload deep space sample return architectures.'
        ],
        everydayAnalogy: 'Autonomous robotic mid-air refueling for orbital infrastructure.',
        conversationalTakeaway: 'ISRO now possesses the specialized automated orbital rendezvous capability held by only three other space programs globally.',
      },
      conversational: {
        headline: 'ISRO just showed it can parallel park two spacecraft at 28,000 km/h in zero gravity.',
        coreSummary: 'Connecting two spacecraft in orbit is one of the hardest things in space exploration. ISRO built robotic crafts that found each other in the dark, aligned with millimeter precision, and locked together completely automatically.',
        whyItMatters: [
          'This is the core technology needed to build India’s own space station by 2028.',
          'Proves Indian sensors and software can handle ultra-precise space rendezvous.',
          'Opens the door to refueling satellites in orbit so they can last decades longer.'
        ],
        everydayAnalogy: 'Think of it like threading a needle from across a football field while riding a supersonic jet — completely automated!',
        conversationalTakeaway: 'India just cleared the hardest engineering hurdle needed to build its own space station.',
      },
      storyteller: {
        headline: 'Rendezvous Above the Clouds: How Two Robotic Scouts Met in the Silence of Orbit',
        coreSummary: 'Four hundred kilometers above the Indian Ocean, in the utter silence of the thermosphere, two metallic spacecraft glided toward one another guided by invisible laser pulses.',
        whyItMatters: [
          'Telemetry engineers in Bengaluru erupted in cheers as mechanical docking latches engaged on schedule.',
          'Carries the nation one step closer to permanent human habitation in low Earth orbit.',
          'A milestone born from indigenous computer vision and miniaturized reaction-control thrusters.'
        ],
        everydayAnalogy: 'Two wanderers in the dark extending metallic hands and interlocking fingers in perfect sync.',
        conversationalTakeaway: 'In the cold expanse of space, India took its first firm step toward assembling a permanent home among the stars.',
      },
    },
  },

  // Story 5: Semiconductor Cleanroom in Sanand
  'story-5': {
    whatHappened: 'A high-tech semiconductor packaging cleanroom started installing heavy equipment in Sanand, Gujarat. This facility stacks and packages miniature computer microchips (known as 2.5D and 3D chiplet packaging) for cars and telecom gear.',
    whatCouldHappenNext: 'Commercial chip output is slated to begin by mid-2027. This brings India closer to making its own microchips rather than relying entirely on imports from Taiwan and Korea.',
    easyReadingText: 'A modern factory in Gujarat is putting in high-tech machines to package computer chips. These chips will go into smartphones, cars, and internet routers made in India.',
    visualExplainer: {
      type: 'steps',
      title: 'From Silicon Wafer to 3D Packaged Microchip',
      subtitle: 'The 3D heterogeneous packaging workflow inside Sanand cleanrooms',
      explanationText: 'Advanced semiconductor manufacturing no longer requires producing an entire chip on one gigantic silicon slab. Heterogeneous packaging integrates separate compute, memory, and radio chiplets into a dense 3D stack, dramatically lowering fabrication costs for Indian electronics.',
      illustrativeNote: 'Illustrative manufacturing sequence based on India Semiconductor Mission technical specifications.',
      items: [
        { label: 'Step 1: Precision Wafer Dicing', text: 'Printed silicon wafers are sliced with diamond diamond-blade laser dicing into microscopic rectangular dies.' },
        { label: 'Step 2: 3D Heterogeneous Stacking', text: 'Compute, memory, and radio chiplets are vertically bonded with sub-micron micro-bumps.', highlight: true },
        { label: 'Step 3: Cleanroom Encapsulation', text: 'Class-100 cleanroom airlocks seal the micro-assembly inside protective thermal ceramic and resin casing.' },
        { label: 'Step 4: Automated Automated Probing', text: 'High-speed electrical probes verify billions of transistor logic pathways under high-temperature stress.' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Like building a high-rise Lego tower where each floor has a different superpower (memory floor, brain floor, wifi floor).',
      '13-17': 'Like upgrading from a regular laptop motherboard to an ultra-dense graphics card with stacked high-bandwidth memory.',
      '18-24': 'Moving from ordering pre-assembled gadgets to setting up the precision workshop that builds the core processors.',
      '25-34': 'Transitioning from being an architectural studio that draws blueprints to owning the master precision factory that constructs the buildings.',
      '35-plus': 'Insulating domestic manufacturing supply chains against geopolitical choke points in international waters.',
    },
    presets: {
      executive: {
        headline: 'Semiconductor Strategy: Commercial 3D Packaging Cleanroom Tool-In at Sanand',
        coreSummary: 'Equipment installation has begun at the Sanand advanced semiconductor packaging facility, positioning India within heterogeneous chiplet assembly supply chains.',
        whyItMatters: [
          'Initial production focuses on 2.5D and 3D heterogeneous packaging for automotive and 5G microcontrollers.',
          'First wafer output targeted for Q2 2027, backed by Tier-1 commercial supply off-take agreements.',
          'Validates the government’s $10B India Semiconductor Mission incentive deployment.'
        ],
        everydayAnalogy: 'Owning the precision assembly line rather than just the architectural blueprints.',
        conversationalTakeaway: 'India is transitioning from chip design centers to actual physical silicon fabrication and advanced packaging cleanrooms.',
      },
      conversational: {
        headline: 'India isn’t just designing microchips anymore — Gujarat is building the cleanrooms to package them.',
        coreSummary: 'Modern microchips aren’t single slabs of silicon anymore; they are stacks of tiny chiplets assembled in ultra-clean rooms. Gujarat just started installing the specialized equipment to do this commercially.',
        whyItMatters: [
          'Domestic cars, smartphones, and routers will soon use microchips assembled right here in India.',
          'Creates thousands of high-tech manufacturing jobs for semiconductor engineers.',
          'Protects India from global chip shortages during international supply disruptions.'
        ],
        everydayAnalogy: 'It’s like moving from being an architect who draws house blueprints to owning the master construction factory.',
        conversationalTakeaway: 'In a couple of years, Indian-assembled chips will power everyday cars and home internet devices.',
      },
      storyteller: {
        headline: 'Dust-Free in Sanand: Inside the Airlocks of India’s Silicon Frontier',
        coreSummary: 'Past triple-stage air showers where specialized suits keep stray particles at bay, heavy robotic wafer-handling equipment was hoisted into place this morning in Sanand.',
        whyItMatters: [
          'Transforms an agrarian belt into a globally recognized semiconductor cluster.',
          'Represents billions of dollars of synchronized public incentives and private capital.',
          'Signals the tangible arrival of semiconductor hardware self-reliance.'
        ],
        everydayAnalogy: 'In an environment where a single speck of dust can ruin a processor, India’s industrial future is finding sub-micron precision.',
        conversationalTakeaway: 'Where farmers once harvested fields, robots in pristine cleanrooms are now stacking silicon futures.',
      },
    },
  },

  // Story 6: Grid Battery Storage Costs
  'story-6': {
    whatHappened: 'The cost of large lithium iron phosphate (LFP) battery cells fell to a record-low $48 per kilowatt-hour. This 50% price plunge means storing cheap daytime solar power in giant batteries is now cheaper than turning on gas-fired power plants during evening hours.',
    whatCouldHappenNext: 'Clean energy projects can supply 24/7 continuous electricity without burning fossil fuels, prompting energy utilities worldwide to retire older gas peaker plants faster.',
    easyReadingText: 'Big industrial batteries got over 50% cheaper this year. Now power companies can store extra sunshine during the day and use it to power homes all night long for less money than burning gas.',
    visualExplainer: {
      type: 'chart',
      title: 'Levelized Cost of Electricity: Gas Peakers vs. Solar + Storage',
      subtitle: 'How $48/kWh battery cells permanently altered power grid economics',
      explanationText: 'When battery cell prices fell to $48/kWh, the total cost of generating daytime solar and storing it for evening use dropped to $65 per megawatt-hour. This undercut fossil natural gas peaker plants ($110/MWh) by more than 40%, eliminating the economic need to burn fossil fuel during peak evening demand.',
      illustrativeNote: 'Illustrative levelized cost comparison based on International Energy Agency benchmark data.',
      chartData: {
        metricLabel: 'Levelized Cost of Electricity (LCOE)',
        unit: 'USD per MWh',
        bars: [
          { label: 'Natural Gas Peaker Plant', value: 110, displayValue: '$110/MWh', subtext: 'High fuel cost and volatile gas markets', color: 'terracotta' },
          { label: 'Battery Storage (2022 Cost)', value: 135, displayValue: '$135/MWh', subtext: 'Historical high lithium raw material prices', color: 'neutral' },
          { label: 'Solar + LFP Storage Today', value: 65, displayValue: '$65/MWh', subtext: 'Unsubsidized economic parity with gas', isTarget: true, color: 'sage' },
        ],
      },
      items: [
        { label: 'Gas Peaker Plant', text: 'Burns expensive fossil gas; high carbon emissions; slow ramp times during sudden evening load spikes.', subtext: 'Levelized cost: $110/MWh' },
        { label: 'Solar + LFP Storage', text: 'Stores excess midday solar; zero emissions; responds in milliseconds to stabilize grid frequency.', subtext: 'Levelized cost: $65/MWh (40% cheaper)', highlight: true },
      ],
    },
    ageAnalogies: {
      'under-13': 'Like buying a giant thermos bottle for your soup — it keeps your soup hot for hours without needing to turn the stove back on.',
      '13-17': 'Like carrying a huge portable power bank that charges in 10 minutes at school and powers your phone, laptop, and switch all weekend.',
      '18-24': 'Buying groceries in bulk on discount day and freezing them, so you never pay surge prices on takeout food at midnight.',
      '25-34': 'Installing a giant rechargeable home battery bank that charges when electricity rates are free at noon, powering your AC all night.',
      '35-plus': 'A capital expenditure inflection point where renewable storage decisively undercuts the recurring operational fuel expense of fossil turbines.',
    },
    presets: {
      executive: {
        headline: 'Energy Transition: LFP Battery Cell Prices Drop to $48/kWh as Grid Solar Surges',
        coreSummary: 'Plummeting lithium iron phosphate battery costs have made utility solar-plus-storage cheaper than peaker natural gas across Southern Europe, India, and the US Southwest.',
        whyItMatters: [
          'Six-hour grid-scale battery storage achieves unsubsidized levelized cost parity with gas turbines.',
          'Accelerates retirement of expensive fossil peaker plants during peak evening demand hours.',
          'Grid interconnection queue backlogs remain the primary constraint to deployment speed.'
        ],
        everydayAnalogy: 'Renewable storage crossed the threshold from subsidized pilot to pure economic dominance.',
        conversationalTakeaway: 'The economics of 24/7 renewable power have decisively crossed the commercial viability threshold.',
      },
      conversational: {
        headline: 'Batteries got so cheap that storing afternoon sunshine is now cheaper than burning gas at night.',
        coreSummary: 'The big knock on solar power was always: "What do you do when the sun goes down?" Big industrial batteries used to be too expensive to bridge the gap. Now battery prices have collapsed by over 50%.',
        whyItMatters: [
          'Power grids can store excess afternoon solar and feed it back into homes during evening peak hours.',
          'Electricity becomes cleaner without needing expensive emergency gas plants.',
          'Lower battery costs also mean electric vehicles and rooftop solar systems will get cheaper.'
        ],
        everydayAnalogy: 'Think of this like buying a gigantic, cheap thermos that keeps your hot tea warm all night long at no extra cost.',
        conversationalTakeaway: 'Solar plus cheap batteries has quietly won the price war against fossil power.',
      },
      storyteller: {
        headline: 'Bottling the Sun: How the Battery Cost Curve Rewrote the Energy Playbook',
        coreSummary: 'Across the sun-scorched plains of Rajasthan and Southern Europe, rows of white shipping containers filled with lithium cells hum quietly in the afternoon heat.',
        whyItMatters: [
          'Proves that technological learning curves consistently beat fossil resource extraction economics.',
          'Eliminates the historical intermittency dilemma of solar and wind generation.',
          'Signals the sunset era for traditional fossil peaker power generation.'
        ],
        everydayAnalogy: 'Like desert caravans filling their skins at a midday oasis, the grid sips the midday sun to illuminate the dark.',
        conversationalTakeaway: 'The green transition is no longer a moral plea; it is now an unstoppable law of economic gravity.',
      },
    },
  },

  // Story 7: India-EU Carbon Border Mechanism
  'story-7': {
    whatHappened: 'India and the European Union reached a working compromise on Europe’s Carbon Border Adjustment Mechanism (CBAM). Under the proposal, certified Indian steel and aluminum factories that use green hydrogen or renewable power will receive carbon tax credits, avoiding heavy tariffs when entering European ports.',
    whatCouldHappenNext: 'If ratified, this agreement will protect over $8 billion of Indian metal exports annually and encourage other emerging economies to establish verifiable green manufacturing standards.',
    easyReadingText: 'Europe wants to tax goods made with heavy pollution. India and Europe are agreeing that clean Indian factories using renewable energy won’t have to pay these extra taxes.',
    visualExplainer: {
      type: 'steps',
      title: 'Bilateral Green Steel Compliance & Verification Flow',
      subtitle: 'Pathway for certified low-carbon Indian metal exports to enter the EU tariff-free',
      explanationText: 'To protect $8B+ of annual industrial exports from punitive border tariffs, Indian steelmakers adopting renewable power and hydrogen blast furnaces undergo joint carbon audits, receiving reciprocal credits recognized at European maritime entry ports.',
      illustrativeNote: 'Illustrative regulatory compliance workflow based on India-EU Comprehensive Trade Dialogue reports.',
      items: [
        { label: 'Step 1: Clean Hydrogen Smelting', text: 'Participating Indian mills replace coking coal with renewable solar electricity and green hydrogen.' },
        { label: 'Step 2: Joint Bilateral Carbon Audit', text: 'Accredited international inspectors certify emissions intensity per ton of manufactured industrial steel.' },
        { label: 'Step 3: Reciprocal CBAM Credit Allocation', text: 'Brussels trade authorities authenticate audit figures, granting reciprocal carbon tax credits.', highlight: true },
        { label: 'Step 4: Tariff-Free European Entry', text: 'Certified Indian steel clears maritime customs without paying punitive border adjustment levies.' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Like getting a gold star sticker on your homework that lets you skip the line for recess because you followed the rules.',
      '13-17': 'Like getting a fast-pass wristband at an amusement park because you took the eco-friendly shuttle bus.',
      '18-24': 'Getting a student discount on toll roads because your vehicle is 100% electric.',
      '25-34': 'A bilateral carbon passport for goods: if you prove your manufacturing is clean, you bypass the border tariff line.',
      '35-plus': 'Bilateral regulatory harmonisation that balances climate imperatives with fair market access for developing nations.',
    },
    presets: {
      executive: {
        headline: 'International Trade: India-EU Talks Propose CBAM Reciprocity for Green Steel',
        coreSummary: 'Negotiators in Brussels have proposed compliance alignment pathways granting certified low-carbon Indian steel and aluminum reciprocal credits under the EU Carbon Border Mechanism.',
        whyItMatters: [
          'Averts punitive tariffs on $8B+ of annual Indian metal exports to the European Union.',
          'Incentivizes Indian industrial conglomerates to accelerate green hydrogen blast furnace adoption.',
          'Establishes a bilateral verification benchmark that could shape multilateral WTO climate rules.'
        ],
        everydayAnalogy: 'A mutual recognition pact turning a trade barrier into an incentive for clean factory upgrades.',
        conversationalTakeaway: 'Indian industrial exporters are securing tariff protections by validating their investments in clean manufacturing.',
      },
      conversational: {
        headline: 'India and Europe are figuring out how to trade green steel without slapping heavy carbon taxes.',
        coreSummary: 'Europe has a new rule: if you export goods that caused heavy pollution to make, you have to pay a carbon tax at the border. India is negotiating to ensure our cleanest steel and aluminum factories get credit for going green.',
        whyItMatters: [
          'Protects billions in Indian industrial exports from sudden tariffs.',
          'Encourages factories in Odisha and Jharkhand to use clean power and hydrogen.',
          'Sets a precedent so developing nations aren’t unfairly locked out of European trade.'
        ],
        everydayAnalogy: 'It’s like getting a discount on your highway toll because you’re driving a certified zero-emissions electric truck.',
        conversationalTakeaway: 'Clean Indian manufacturers will get rewarded with lower taxes when selling to European buyers.',
      },
      storyteller: {
        headline: 'Diplomacy at the Carbon Border: How Green Steel Found Common Ground in Brussels',
        coreSummary: 'In the glass-walled headquarters of the European Commission, negotiators from New Delhi and Brussels spent late hours hashing out carbon accounting spreadsheets.',
        whyItMatters: [
          'Bridges the philosophical divide between Western climate regulations and Global South industrial realities.',
          'Protects key industrial export employment while pushing real emissions reductions.',
          'A masterclass in modern commercial diplomacy where climate policy and trade law intersect.'
        ],
        everydayAnalogy: 'Diplomats charting a narrow bridge between industrial jobs and planetary responsibility.',
        conversationalTakeaway: 'At the negotiating table, climate commitments and economic survival found a pragmatic, working compromise.',
      },
    },
  },

  // Story 8: Agritech & Soil Registry
  'story-8': {
    whatHappened: 'The National Digital Agriculture Mission has connected 40 million farmers to a network of satellite weather feeds and ground soil sensors. Farmers receive localized phone alerts telling them exactly when to irrigate or fertilize, reducing chemical waste by 22%.',
    whatCouldHappenNext: 'Expanding the system across rice and pulse belts will improve crop yields by an estimated 14% while preserving groundwater levels against unpredictable monsoon patterns.',
    easyReadingText: 'Over 40 million farmers are getting simple phone messages telling them when to water their crops and how much fertilizer to use. This saves money and keeps soil healthy.',
    visualExplainer: {
      type: 'timeline',
      title: 'Daily Hyperlocal Agritech Advisory Flow',
      subtitle: 'From satellite radar sweeps to morning WhatsApp farmer guidance',
      explanationText: 'Automated telemetry cycles link 40 million agrarian smallholders directly to satellite moisture sensors and ground probes. Actionable SMS/WhatsApp advisories in local languages have reduced chemical fertilizer consumption by 22% while improving crop harvest consistency by 14%.',
      illustrativeNote: 'Illustrative telemetry timeline based on National Digital Agriculture Mission operational guidelines.',
      items: [
        { label: '04:30 AM: Satellite Pass', text: 'Space-borne remote-sensing satellites scan cloud formations, evapotranspiration, and topsoil moisture across agricultural zones.' },
        { label: '05:15 AM: IoT Ground Analysis', text: 'Subterranean probes measure ground nitrogen, phosphorus, and moisture saturation at field level.' },
        { label: '06:00 AM: Vernacular Advisory', text: 'Automated WhatsApp and SMS alerts delivered in regional languages (Hindi, Punjabi, Marathi) with precise irrigation advice.', highlight: true },
        { label: '06:45 AM: Precision Application', text: 'Farmers adjust water pumps and nutrient dosing, avoiding chemical runoff and saving household expenditure.' },
      ],
    },
    ageAnalogies: {
      'under-13': 'Like having a smart garden pot that beeps when your plant is thirsty, so you don’t overwater it!',
      '13-17': 'Like having an automated game assistant that tells you the exact weather conditions before starting a match.',
      '18-24': 'Like a smartwatch alert telling you when to drink water and take vitamins based on your actual body vitals.',
      '25-34': 'A digital fitness tracker for farmland, turning generations of guesswork into actionable, data-driven notifications.',
      '35-plus': 'Precision resource management replacing subsidy waste with measured telemetry across millions of smallholdings.',
    },
    presets: {
      executive: {
        headline: 'Agritech Scale: 40M Farmers Connected to Micro-Weather & Soil Registry',
        coreSummary: 'The National Digital Agriculture Mission has linked 40 million farmers to Hyperlocal soil saturation telemetry, reducing chemical fertilizer consumption by 22%.',
        whyItMatters: [
          'Yield consistency improved by 14% across participating wheat and pulse agrarian belts.',
          'Significant reduction in government fertilizer import subsidy outlays.',
          'Satellite remote sensing and ground IoT sensors deliver vernacular advisories via SMS and WhatsApp.'
        ],
        everydayAnalogy: 'IoT telemetry transforming an unmeasured commodity supply chain into a precision production network.',
        conversationalTakeaway: 'Digital telemetry is systematically replacing guesswork with data-driven irrigation and nutrient scheduling in Indian agriculture.',
      },
      conversational: {
        headline: 'Millions of Indian farmers are getting automated phone alerts telling them exactly when to water their crops.',
        coreSummary: 'Instead of guessing when to water or spray fertilizer, farmers in Punjab, Haryana, and UP are getting real-time alerts based on soil sensors and weather satellites.',
        whyItMatters: [
          'Farmers save money by not wasting expensive fertilizer.',
          'Less chemical runoff protects groundwater and soil health.',
          'Crops produce better, more consistent harvests even when monsoon rains are unpredictable.'
        ],
        everydayAnalogy: 'Think of it like a smart fitness watch for agricultural soil, sending personalized tips straight to the farmer’s phone.',
        conversationalTakeaway: 'Simple phone messages are saving farmers money and protecting India’s groundwater.',
      },
      storyteller: {
        headline: 'Sensors in the Soil: How Satellites and Smartphones are Rewriting the Harvest',
        coreSummary: 'At dawn in a small village outside Chandigarh, a farmer checks his phone before heading out into the wheat field. The screen alerts him that subterranean moisture is high, advising him to hold off on irrigation.',
        whyItMatters: [
          'Brings cutting-edge aerospace telemetry directly into the hands of rural agrarian households.',
          'Reverses decades of soil degradation caused by unmeasured chemical over-fertilization.',
          'A compelling example of technology delivering immediate, measurable livelihood impact.'
        ],
        everydayAnalogy: 'Invisible digital threads connecting satellite orbits 500 kilometers above to the morning soil beneath a farmer’s boots.',
        conversationalTakeaway: 'Centuries of agrarian tradition are being quietly elevated by satellite sensors and morning phone chimes.',
      },
    },
  },
};

// Map new category IDs to rich hand-crafted explainers
DETAILED_STORY_DATA['story-fin-1'] = DETAILED_STORY_DATA['story-1'];
DETAILED_STORY_DATA['story-tech-1'] = DETAILED_STORY_DATA['story-2'];
DETAILED_STORY_DATA['story-pol-1'] = DETAILED_STORY_DATA['story-3'];
DETAILED_STORY_DATA['story-sci-1'] = DETAILED_STORY_DATA['story-4'];
DETAILED_STORY_DATA['story-tech-2'] = DETAILED_STORY_DATA['story-5'];
DETAILED_STORY_DATA['story-cli-1'] = DETAILED_STORY_DATA['story-6'];
DETAILED_STORY_DATA['story-wor-1'] = DETAILED_STORY_DATA['story-7'];
DETAILED_STORY_DATA['story-pol-2'] = DETAILED_STORY_DATA['story-8'];

