import { QuestQuestion, QuestBadge, Story, TopicCategory, ReaderQuestProgress } from '../types';

export const QUEST_BADGES: QuestBadge[] = [
  {
    id: 'first-quest',
    title: 'Morning Scholar',
    description: 'Completed your first daily edition news inquiry',
    icon: '🏅',
    category: 'general',
  },
  {
    id: 'perfect-score',
    title: 'Master of the Broadsheet',
    description: 'Achieved 100% accuracy on a daily edition news quest',
    icon: '🎯',
    category: 'general',
  },
  {
    id: 'points-100',
    title: 'Knowledge Seeker',
    description: 'Accumulated 100+ Knowledge Points across editions',
    icon: '💡',
    category: 'general',
  },
  {
    id: 'economy-analyst',
    title: 'Macro Analyst',
    description: 'Mastered a Markets & Economy inquiry',
    icon: '📈',
    category: 'economy',
  },
  {
    id: 'tech-explorer',
    title: 'Tech Vanguard',
    description: 'Mastered a Technology & AI inquiry',
    icon: '🤖',
    category: 'tech',
  },
  {
    id: 'logistics-scholar',
    title: 'Governance & Infra Scholar',
    description: 'Mastered a Policy & Infrastructure inquiry',
    icon: '📜',
    category: 'policy',
  },
  {
    id: 'climate-guardian',
    title: 'Energy Vanguard',
    description: 'Mastered a Climate & Clean Energy inquiry',
    icon: '🌿',
    category: 'climate',
  },
  {
    id: 'world-observer',
    title: 'Global Envoy',
    description: 'Mastered a World Intelligence inquiry',
    icon: '🌐',
    category: 'world',
  },
  {
    id: 'science-scholar',
    title: 'Cosmic Investigator',
    description: 'Mastered a Science & Space exploration inquiry',
    icon: '🔭',
    category: 'science',
  },
  {
    id: 'culture-patron',
    title: 'Culture & Arts Critic',
    description: 'Mastered a Sports & Contemporary Arts inquiry',
    icon: '🎨',
    category: 'sports_culture',
  },
];

export const SAMPLE_QUESTIONS: QuestQuestion[] = [
  {
    id: 'quest-story-fin-1',
    storyId: 'story-fin-1',
    storyTitle: 'RBI Signals Measured Liquidity Path as Core Inflation Moderates to 3.8%',
    category: 'finance',
    question: 'In this illustrative economy scenario, to what level did core industrial and consumer price inflation cool?',
    options: [
      'Accelerated to 7.4% due to seasonal harvest shortages',
      'Cooled to a 14-month low of 3.8%',
      'Remained locked at the 6.50% repo rate target',
      'Dropped to 1.2%, triggering emergency rate cuts',
    ],
    correctIndex: 1,
    explanation: 'In this illustrative broadsheet scenario, core price pressures across industrial inputs and urban consumables cooled to a 14-month low of 3.8%, giving manufacturers margin stability while the MPC maintained a neutral stance.',
    conceptTag: 'Demo Scenario: Monetary Policy',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-tech-1',
    storyId: 'story-tech-1',
    storyTitle: 'Open-Weight AI Models Challenge Commercial Cloud Dominance Across Indian Enterprises',
    category: 'tech',
    question: 'In this illustrative enterprise AI scenario, what performance and economic benefits were highlighted?',
    options: [
      'They are legally mandated to discontinue all commercial cloud software',
      'Open models achieved 94% accuracy parity at one-third the token expense with 7-month server payback',
      'Commercial cloud APIs have permanently shut down operations across Asia',
      'Open models can only process English tokens without multilingual support',
    ],
    correctIndex: 1,
    explanation: 'In this illustrative technology scenario, benchmark data confirmed 94% accuracy parity on high-quality Indic tokens at one-third the token inference expense, with server hardware payback in seven months.',
    conceptTag: 'Demo Scenario: Sovereign AI',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-pol-1',
    storyId: 'story-pol-1',
    storyTitle: 'Dedicated Freight Corridors Cut Western Transit Time Between Delhi and Mumbai by 38 Hours',
    category: 'policy',
    question: 'In this Western DFC logistics scenario, what operational speed and transit time gains were modeled?',
    options: [
      'Locomotives now travel at 140 km/h with no cargo checkpoints',
      'Average speeds rose from 25 km/h to 68 km/h, reducing freight transit time by 38 hours',
      'Transit times increased by 12 hours due to electrical testing',
      'Locomotive speeds stayed at 25 km/h but fuel consumption doubled',
    ],
    correctIndex: 1,
    explanation: 'In this infrastructure scenario based on the Western DFC, automated double-stack lines boosted average train speeds from 25 km/h to 68 km/h, cutting transit times by 38 hours and reducing aggregate logistics costs by 18%.',
    conceptTag: 'Demo Scenario: Freight Infrastructure',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-sci-1',
    storyId: 'story-sci-1',
    storyTitle: 'ISRO Completes Critical Autonomous Docking Test for Next-Generation Orbital Station',
    category: 'science',
    question: 'What milestone did ISRO’s SpaDeX robotic demonstration achieve in low Earth orbit?',
    options: [
      'Sub-millimeter latching alignment and autonomous propellant transfer using laser rangefinders',
      'A manned lunar landing with immediate mineral retrieval',
      'Emergency manual thruster maneuvers controlled from Sriharikota',
      'Deploying commercial broadband internet constellations',
    ],
    correctIndex: 0,
    explanation: 'Reflecting ISRO’s Space Docking Experiment (SpaDeX), twin spacecraft (SDX01 Chaser and SDX02 Target) executed automated rendezvous and sub-millimeter latching without ground intervention, meeting technical prerequisites for the Bharatiya Antariksh Station.',
    conceptTag: 'SpaDeX Mission: Space Technology',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-cli-1',
    storyId: 'story-cli-1',
    storyTitle: 'Global Renewable Energy Additions Surge 32% as Grid-Scale Battery Storage Prices Plummet',
    category: 'climate',
    question: 'In this global clean energy scenario, what economic threshold made solar-plus-storage cheaper than peaker gas?',
    options: [
      'Thermal coal costs dropped by 80% worldwide',
      'Lithium iron phosphate (LFP) cell costs fell to a record low of $48/kWh',
      'Governments disconnected high-voltage transmission lines',
      'Hydroelectric dams replaced all wind turbine installations',
    ],
    correctIndex: 1,
    explanation: 'In this illustrative energy scenario, steep deflation in LFP battery cells ($48/kWh) made utility-scale solar paired with storage the lowest levelized cost of electricity, outcompeting peaker gas across major sunny markets.',
    conceptTag: 'Demo Scenario: Clean Energy Economics',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-wor-1',
    storyId: 'story-wor-1',
    storyTitle: 'India-EU Comprehensive Trade Dialogue Enters Decisive Phase on Carbon Border Mechanism',
    category: 'world',
    question: 'Under the modeled compromise on the EU Carbon Border Adjustment Mechanism (CBAM), what incentive was proposed for Indian manufacturers?',
    options: [
      'A complete embargo on all Indian industrial exports to Europe',
      'Certified energy-efficient steel and aluminum producers receive reciprocal credits against CBAM',
      'Mandatory flat carbon fines regardless of factory energy source',
      'Replacing trade agreements with unilateral export quotas',
    ],
    correctIndex: 1,
    explanation: 'In this illustrative bilateral trade scenario, verified low-carbon Indian steel and aluminum producers receive reciprocal credits against CBAM tariffs, safeguarding export viability while encouraging green hydrogen adoption.',
    conceptTag: 'Demo Scenario: Decarbonization Trade',
    isDemoQuestion: true,
  },
  {
    id: 'quest-story-spo-1',
    storyId: 'story-spo-1',
    storyTitle: 'Women’s Premier League Expansion Adds Two Franchises as Viewership Sets Global Mark',
    category: 'sports_culture',
    question: 'In the WPL league expansion scenario, what milestones were recorded?',
    options: [
      'The league was downsized to three teams',
      'Two new franchises added in Ahmedabad and Lucknow after digital viewership crossed 185 million',
      'All commercial sponsorships were postponed indefinitely',
      'The league transitioned permanently to closed private streaming',
    ],
    correctIndex: 1,
    explanation: 'Following digital viewership of 185 million viewers, the board sanctioned expansion from 5 to 7 franchises with new teams in Ahmedabad and Lucknow.',
    conceptTag: 'Sports Expansion: WPL Growth',
    isDemoQuestion: true,
  },
];

export const questService = {
  getBadges(): QuestBadge[] {
    return QUEST_BADGES;
  },

  getBadgeById(id: string): QuestBadge | undefined {
    return QUEST_BADGES.find((b) => b.id === id);
  },

  getQuestionsForStories(stories: Story[]): QuestQuestion[] {
    if (!stories || stories.length === 0) {
      return SAMPLE_QUESTIONS.slice(0, 3);
    }

    const storyIds = new Set(stories.map((s) => s.id));
    const matched = SAMPLE_QUESTIONS.filter((q) => storyIds.has(q.storyId));

    if (matched.length >= 3) {
      return matched.slice(0, 4);
    }

    // If fewer than 3 matched (e.g. customized topics or live RSS feed), construct dynamic questions for remaining stories
    const results = [...matched];
    for (const story of stories) {
      if (results.length >= 4) break;
      if (results.some((q) => q.storyId === story.id)) continue;

      // Extract authentic grounded excerpt directly from story
      const rawText = (story.deck && story.deck.trim().length > 20)
        ? story.deck.trim()
        : (story.content && story.content.trim().length > 20)
        ? story.content.trim()
        : story.title;

      const cleanSummary = rawText.replace(/<[^>]+>/g, '').trim();
      const firstSentence = cleanSummary.split(/(?<=[.!?])\s+/)[0] || cleanSummary;
      const verifiedFact = firstSentence.length > 180 ? firstSentence.slice(0, 177) + '...' : firstSentence;

      // Plausible topical distractors
      const distractors = [
        'The reported program was formally cancelled following an independent regulatory audit.',
        'All related operations were indefinitely postponed due to unresolved supply bottlenecks.',
        'An independent assessment concluded the program yielded no measurable change in metrics.',
      ];

      // Deterministically vary correct index across 0, 1, 2, 3 so it is not always Option A
      const targetCorrectIndex = (story.id.length + story.title.length) % 4;
      const options = [...distractors];
      options.splice(targetCorrectIndex, 0, verifiedFact);

      const question: QuestQuestion = {
        id: `quest-dynamic-${story.id}`,
        storyId: story.id,
        storyTitle: story.title,
        category: story.category,
        question: `According to reporting by ${story.sourceName} in "${story.title}", what development was confirmed?`,
        options,
        correctIndex: targetCorrectIndex,
        explanation: `As reported in ${story.sourceName}'s dispatch: "${verifiedFact}"`,
        conceptTag: `${story.sourceMode === 'rss' ? 'Live RSS' : 'Curated'}: ${story.category.toUpperCase()}`,
        isDemoQuestion: story.sourceMode !== 'rss',
      };

      results.push(question);
    }

    // Fallback guarantee: if still less than 3, pad with top sample questions
    if (results.length < 3) {
      for (const sq of SAMPLE_QUESTIONS) {
        if (!results.some((r) => r.id === sq.id)) {
          results.push(sq);
        }
        if (results.length >= 3) break;
      }
    }

    return results;
  },

  evaluateNewBadges(
    currentBadgeIds: string[],
    newTotalPoints: number,
    correctCount: number,
    totalCount: number,
    testedCategory?: TopicCategory
  ): string[] {
    const unlocked: string[] = [];
    const hasBadge = (id: string) => currentBadgeIds.includes(id) || unlocked.includes(id);

    // First quest completed
    if (!hasBadge('first-quest') && totalCount > 0) {
      unlocked.push('first-quest');
    }

    // Perfect score on a quest (all attempted questions answered correctly, min 2 questions)
    if (!hasBadge('perfect-score') && totalCount >= 2 && correctCount === totalCount) {
      unlocked.push('perfect-score');
    }

    // 100+ points
    if (!hasBadge('points-100') && newTotalPoints >= 100) {
      unlocked.push('points-100');
    }

    // Category specific badges
    if (testedCategory) {
      const categoryBadgeMap: Partial<Record<TopicCategory, string>> = {
        finance: 'economy-analyst',
        economy: 'economy-analyst',
        tech: 'tech-explorer',
        policy: 'logistics-scholar',
        climate: 'climate-guardian',
        world: 'world-observer',
        science: 'science-scholar',
        sports_culture: 'culture-patron',
      };

      const targetBadge = categoryBadgeMap[testedCategory];
      if (targetBadge && !hasBadge(targetBadge)) {
        unlocked.push(targetBadge);
      }
    }

    return unlocked;
  },

  getDefaultQuestProgress(): ReaderQuestProgress {
    return {
      totalPoints: 0,
      unlockedBadgeIds: [],
      completedEditionDates: [],
      answeredQuestions: {},
      showNewsQuest: true,
    };
  },
};
