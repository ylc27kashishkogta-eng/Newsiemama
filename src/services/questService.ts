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
];

export const SAMPLE_QUESTIONS: QuestQuestion[] = [
  {
    id: 'quest-story-1',
    storyId: 'story-1',
    storyTitle: 'RBI Signals Measured Liquidity Path as Core Inflation Moderates to 3.8%',
    category: 'economy',
    question: 'According to the Reserve Bank of India’s updated forward guidance, to what level did core industrial and consumer price inflation cool?',
    options: [
      'Accelerated to 7.4% due to seasonal harvest shortages',
      'Cooled to a 14-month low of 3.8%',
      'Remained locked at the 6.50% repo rate target',
      'Dropped to 1.2%, triggering emergency rate cuts',
    ],
    correctIndex: 1,
    explanation: 'Core price pressures across industrial inputs and urban consumables cooled to a 14-month low of 3.8%, giving manufacturers margin stability while the MPC maintained a neutral stance.',
    conceptTag: 'Monetary Policy & Inflation',
  },
  {
    id: 'quest-story-2',
    storyId: 'story-2',
    storyTitle: 'Open-Weight AI Models Challenge Commercial Cloud Dominance Across Indian Enterprises',
    category: 'tech',
    question: 'What performance and economic benefits are driving Indian enterprise leaders toward self-hosted open-weight AI models?',
    options: [
      'They are legally mandated to discontinue all commercial cloud software',
      'Open models achieved 94% accuracy parity at one-third the token expense with 7-month server payback',
      'Commercial cloud APIs have permanently shut down operations across Asia',
      'Open models can only process English tokens without multilingual support',
    ],
    correctIndex: 1,
    explanation: 'Benchmark data confirmed 94% accuracy parity on high-quality Indic tokens at one-third the token inference expense, offering sovereign data protection and hardware payback in seven months.',
    conceptTag: 'Enterprise AI & Data Sovereignty',
  },
  {
    id: 'quest-story-3',
    storyId: 'story-3',
    storyTitle: 'Dedicated Freight Corridors Cut Western Transit Time Between Delhi and Mumbai by 38 Hours',
    category: 'policy',
    question: 'What operational speed and transit time gains were achieved with the full operationalization of the Western DFC?',
    options: [
      'Locomotives now travel at 140 km/h with no cargo checkpoints',
      'Average speeds rose from 25 km/h to 68 km/h, reducing freight transit time by 38 hours',
      'Transit times increased by 12 hours due to electrical testing',
      'Locomotive speeds stayed at 25 km/h but fuel consumption doubled',
    ],
    correctIndex: 1,
    explanation: 'Automated double-stack electric lines boosted average train speeds from 25 km/h to 68 km/h, cutting transit times by nearly two days (38 hours) and reducing aggregate logistics costs by 18%.',
    conceptTag: 'Freight Logistics & Infrastructure',
  },
  {
    id: 'quest-story-4',
    storyId: 'story-4',
    storyTitle: 'ISRO Completes Critical Autonomous Docking Test for Next-Generation Orbital Station',
    category: 'tech',
    question: 'What milestone did ISRO’s robotic orbital demonstration achieve in low Earth orbit?',
    options: [
      'Sub-millimeter latching alignment and autonomous propellant transfer using laser rangefinders',
      'A manned lunar landing with immediate mineral retrieval',
      'Emergency manual thruster maneuvers controlled from Sriharikota',
      'Deploying commercial broadband internet constellations',
    ],
    correctIndex: 0,
    explanation: 'Two miniaturized modules executed automated rendezvous and sub-millimeter latching without ground intervention, meeting the technical prerequisite for the 2028 Bharatiya Antariksh Station.',
    conceptTag: 'Orbital Robotics & Space Exploration',
  },
  {
    id: 'quest-story-5',
    storyId: 'story-5',
    storyTitle: 'Semiconductor Cluster in Sanand Breaks Ground on Commercial 3D Packaging Cleanroom',
    category: 'economy',
    question: 'What supply chain capability is being established at the new Sanand semiconductor packaging cleanroom?',
    options: [
      'Tool-in for advanced 2.5D and 3D heterogeneous packaging with test wafers in early Q2 2027',
      'Mass assembly of complete consumer desktop monitors',
      'Decommissioning legacy 8-inch silicon fabrication equipment',
      'Exclusive export of raw silica sand for foreign foundries',
    ],
    correctIndex: 0,
    explanation: 'The facility under the India Semiconductor Mission focuses on high-density 2.5D and 3D heterogeneous packaging for automotive and telecommunications microcontrollers, with test output targeted for Q2 2027.',
    conceptTag: 'Semiconductor Manufacturing',
  },
  {
    id: 'quest-story-6',
    storyId: 'story-6',
    storyTitle: 'Global Renewable Energy Additions Surge 32% as Grid-Scale Battery Storage Prices Plummet',
    category: 'climate',
    question: 'What economic threshold has made solar-plus-storage cheaper than peaker gas in major markets?',
    options: [
      'Thermal coal costs dropped by 80% worldwide',
      'Lithium iron phosphate (LFP) cell costs fell to a record low of $48/kWh',
      'Governments disconnected high-voltage transmission lines',
      'Hydroelectric dams replaced all wind turbine installations',
    ],
    correctIndex: 1,
    explanation: 'Plummeting LFP battery cell costs ($48/kWh) made 6-hour utility-scale solar paired with storage the lowest levelized cost of electricity, outcompeting conventional gas peakers across Southern Europe, India, and the US Southwest.',
    conceptTag: 'Clean Energy Economics',
  },
  {
    id: 'quest-story-7',
    storyId: 'story-7',
    storyTitle: 'India-EU Comprehensive Trade Dialogue Enters Decisive Phase on Carbon Border Mechanism',
    category: 'world',
    question: 'Under the evolving compromise on the EU Carbon Border Adjustment Mechanism (CBAM), what incentive is proposed for Indian manufacturers?',
    options: [
      'A complete embargo on all Indian industrial exports to Europe',
      'Certified energy-efficient steel and aluminum producers receive reciprocal credits against CBAM',
      'Mandatory flat carbon fines regardless of factory energy source',
      'Replacing trade agreements with unilateral export quotas',
    ],
    correctIndex: 1,
    explanation: 'Under the bilateral compromise framework, verified low-carbon Indian steel and aluminum producers will receive reciprocal credits against CBAM tariffs, safeguarding export viability while encouraging green hydrogen adoption.',
    conceptTag: 'International Trade & Decarbonization',
  },
  {
    id: 'quest-story-8',
    storyId: 'story-8',
    storyTitle: 'National Digital Agriculture Mission Connects 40 Million Farmers to Real-Time Soil Sensor Grids',
    category: 'policy',
    question: 'How does the digital agrarian advisory network benefit participating farmers in agrarian zones?',
    options: [
      'Replaces all manual crop tending with robotic harvesters',
      'Delivers vernacular microclimate telemetry via SMS/WhatsApp, reducing pesticide use by 22% and improving yields by 14%',
      'Requires farmers to purchase chemical fertilizers exclusively through foreign portals',
      'Restricts crop sales exclusively to centralized international exchanges',
    ],
    correctIndex: 1,
    explanation: 'Real-time soil nitrogen saturation and micro-weather forecasts sent via vernacular messaging optimize irrigation schedules, leading to a 22% drop in pesticide use and a 14% boost in crop yield consistency.',
    conceptTag: 'Digital Agritech & Rural Economy',
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

      // Construct grounded question from story deck & title
      const question: QuestQuestion = {
        id: `quest-dynamic-${story.id}`,
        storyId: story.id,
        storyTitle: story.title,
        category: story.category,
        question: `According to reporting in "${story.title}", what key development was highlighted?`,
        options: [
          story.deck || 'The reported initiative entered its next phase of development.',
          'The program was discontinued due to lack of stakeholder participation.',
          'All operations were indefinitely postponed without target completion dates.',
          'Independent review concluded the development had no measurable impact.',
        ],
        correctIndex: 0,
        explanation: `As reported by ${story.sourceName}: ${story.deck || story.content.slice(0, 180) + '...'}`,
        conceptTag: `${story.category.toUpperCase()} Reporting`,
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
      const categoryBadgeMap: Record<TopicCategory, string> = {
        economy: 'economy-analyst',
        tech: 'tech-explorer',
        policy: 'logistics-scholar',
        climate: 'climate-guardian',
        world: 'world-observer',
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
