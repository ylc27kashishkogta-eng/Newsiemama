export type TopicCategory = 
  | 'finance'
  | 'economy' // legacy alias for finance
  | 'tech' 
  | 'policy' 
  | 'world' 
  | 'climate'
  | 'science'
  | 'sports_culture';

export type FinanceSubcategory =
  | 'all'
  | 'stocks'
  | 'startups'
  | 'personal_finance'
  | 'business'
  | 'economy'
  | 'tech';

export type VoicePreset = 
  | 'executive'       // Quick Brief
  | 'conversational'  // Friendly Explainer
  | 'storyteller';    // Storyteller

export type SlangLevel =
  | 'off'     // Straightforward, modern editorial
  | 'subtle'  // Natural, breezy conversational
  | 'vibe';   // Playful Gen Z editorial tone (tl;dr, lowkey, major moves, no cap on facts)

export type StoryLength =
  | 'quick'     // Skimmable bullets & 1-minute read
  | 'balanced'  // Standard 2-3 minute narrative
  | 'deep';     // In-depth context, timelines & background

export type CompanionMood =
  | 'curious'
  | 'hyped'
  | 'thoughtful'
  | 'chill'
  | 'skeptical';

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
  slangLevel?: SlangLevel;
  storyLength?: StoryLength;
  companionEnabled?: boolean;
  customVoice?: CustomVoiceProfile;
  savedArticleIds: string[];
  readStoryIds: string[];
  likedStoryIds: string[];
  dislikedStoryIds: string[];
  questProgress?: ReaderQuestProgress;
  createdAt: string;
  hasCompletedWelcome?: boolean;
}

export interface PlaycardSlide {
  label: string;
  title: string;
  body: string;
  type?: 'what' | 'why' | 'next' | 'takeaway';
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
  financeSubcategory?: FinanceSubcategory;
  readingMinutes: number;
  imageUrl?: string;
  isLeadStory?: boolean;
  sourceMode: 'rss' | 'snapshot';
  curatedReason?: string;
  isDemoStory?: boolean;
  editorialNature?: 'illustrative_demo' | 'live_syndication';
  sourceTypeLabel?: string;
  keyBullets?: string[];
  vibeSummary?: string;
  playcards?: PlaycardSlide[];
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
  slangTakeaway?: string;
  isAnalysisForecast?: boolean;
}

export interface EditionMetadata {
  volumeNumber: number;
  editionDate: string;
  formattedDate: string;
  generatedTimestamp: string;
  totalStories: number;
  isLiveFeed: boolean;
  liveCount?: number;
  demoCount?: number;
}
