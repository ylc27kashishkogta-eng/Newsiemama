export type TopicCategory = 
  | 'economy' 
  | 'tech' 
  | 'policy' 
  | 'world' 
  | 'climate';

export type VoicePreset = 
  | 'executive'       // Quick Brief
  | 'conversational'  // Friendly Explainer
  | 'storyteller';    // Storyteller

export type AgeRange = 
  | 'under-13'
  | '13-17'
  | '18-24'
  | '25-34'
  | '35-plus'
  | 'prefer-not-to-say';

export interface CustomVoiceProfile {
  brevity: 'concise' | 'balanced' | 'detailed';
  formality: 'casual' | 'semi-formal' | 'formal';
  useAnalogies: boolean;
  bulletPreference: boolean;
  rawSample?: string;
  analyzedAt?: string;
}

export interface QuestQuestion {
  id: string;
  storyId: string;
  storyTitle: string;
  category: TopicCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptTag: string;
  isDemoQuestion?: boolean;
}

export interface QuestBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category?: TopicCategory | 'general';
}

export interface ReaderQuestProgress {
  totalPoints: number;
  unlockedBadgeIds: string[];
  completedEditionDates: string[];
  answeredQuestions: Record<string, { selectedIndex: number; isCorrect: boolean }>;
  showNewsQuest: boolean;
}

export interface ReaderProfile {
  id: string;
  name: string;
  ageRange: AgeRange;
  editionTitle: string;
  topics: TopicCategory[];
  voicePreset: VoicePreset;
  customVoice?: CustomVoiceProfile;
  savedArticleIds: string[];
  readStoryIds: string[];
  likedStoryIds: string[];
  dislikedStoryIds: string[];
  questProgress?: ReaderQuestProgress;
  createdAt: string;
  hasCompletedWelcome?: boolean;
}

export interface Story {
  id: string;
  title: string;
  deck: string;
  content: string;
  sourceName: string;
  canonicalUrl: string;
  publishedAt: string;
  timeAgo: string;
  category: TopicCategory;
  readingMinutes: number;
  imageUrl?: string;
  isLeadStory?: boolean;
  sourceMode: 'rss' | 'snapshot';
  curatedReason?: string;
  isDemoStory?: boolean;
  editorialNature?: 'illustrative_demo' | 'live_syndication';
  sourceTypeLabel?: string;
}

export type VisualExplainerType = 'steps' | 'timeline' | 'comparison' | 'map' | 'chart';

export interface VisualExplainerItem {
  type: VisualExplainerType;
  title: string;
  subtitle?: string;
  explanationText?: string;
  illustrativeNote?: string;
  items: {
    label: string;
    text: string;
    subtext?: string;
    highlight?: boolean;
    metric?: string;
    metricLabel?: string;
  }[];
  mapData?: {
    corridorName: string;
    origin: string;
    destination: string;
    statSummary: string;
    stops: {
      name: string;
      role: string;
      isTerminal?: boolean;
      highlight?: boolean;
    }[];
  };
  chartData?: {
    metricLabel: string;
    unit?: string;
    bars: {
      label: string;
      value: number;
      displayValue: string;
      subtext?: string;
      isTarget?: boolean;
      color?: 'terracotta' | 'sage' | 'neutral';
    }[];
  };
}

export interface StoryExplanation {
  headline: string;
  coreSummary: string;
  whatHappened: string;
  whyItMatters: string[];
  whatCouldHappenNext: string;
  everydayAnalogy: string;
  visualExplainer?: VisualExplainerItem;
  easyReadingText: string;
  conversationalTakeaway: string;
  activePreset: VoicePreset;
  isCustomVoiced: boolean;
  ageAdaptedNote?: string;
  predictionDisclaimer?: string;
}

export interface EditionMetadata {
  volumeNumber: number;
  editionDate: string;
  formattedDate: string;
  generatedTimestamp: string;
  totalStories: number;
  isLiveFeed: boolean;
}
