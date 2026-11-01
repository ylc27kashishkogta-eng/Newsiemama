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

export const questService = {
  getBadges(): QuestBadge[] {
    return QUEST_BADGES;
  },

  getBadgeById(id: string): QuestBadge | undefined {
    return QUEST_BADGES.find((b) => b.id === id);
  },

  /**
   * Generates questions ONLY from the real live articles currently retrieved in the edition.
   * If no live articles are loaded, returns an empty array.
   */
  getQuestionsForStories(stories: Story[]): QuestQuestion[] {
    if (!stories || stories.length === 0) {
      return [];
    }

    const validStories = stories.filter((s) => s.canonicalUrl && s.title);
    const selected = validStories.slice(0, 3);

    return selected.map((story, idx) => {
      const rawText = story.content || story.deck || story.title;
      const cleanSummary = rawText.replace(/<[^>]+>/g, '').trim();
      const firstSentence = cleanSummary.split(/(?<=[.!?])\s+/)[0] || cleanSummary;
      const verifiedFact = firstSentence.length > 170 ? firstSentence.slice(0, 167) + '...' : firstSentence;

      const distractors = [
        'The reported program was formally cancelled following an independent regulatory audit.',
        'All related operations were indefinitely postponed due to unresolved supply bottlenecks.',
        'An independent assessment concluded the program yielded no measurable change in metrics.',
      ];

      // Deterministically place correct answer
      const correctIndex = (idx + story.title.length) % 4;
      const options = [...distractors];
      options.splice(correctIndex, 0, verifiedFact);

      return {
        id: `quest-real-${story.id}`,
        storyId: story.id,
        storyTitle: story.title,
        category: story.category,
        question: `According to reporting by ${story.sourceName} in "${story.title}", what was confirmed?`,
        options,
        correctIndex,
        explanation: `As reported in ${story.sourceName}'s live dispatch: "${verifiedFact}"`,
        conceptTag: `Live Feed: ${story.sourceName}`,
        sourceUrl: story.canonicalUrl,
        isDemoQuestion: false,
      };
    });
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

    if (!hasBadge('first-quest') && totalCount > 0) {
      unlocked.push('first-quest');
    }

    if (!hasBadge('perfect-score') && totalCount >= 2 && correctCount === totalCount) {
      unlocked.push('perfect-score');
    }

    if (!hasBadge('points-100') && newTotalPoints >= 100) {
      unlocked.push('points-100');
    }

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
