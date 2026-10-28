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
}

export interface VisualExplainerItem {
  type: 'steps' | 'timeline' | 'comparison';
  title: string;
  subtitle?: string;
  items: {
    label: string;
    text: string;
    subtext?: string;
    highlight?: boolean;
  }[];
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
