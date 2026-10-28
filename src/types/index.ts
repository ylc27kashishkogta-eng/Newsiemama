export type TopicCategory = 
  | 'economy' 
  | 'tech' 
  | 'policy' 
  | 'world' 
  | 'climate';

export type VoicePreset = 
  | 'executive' 
  | 'conversational' 
  | 'storyteller';

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
  editionTitle: string;
  topics: TopicCategory[];
  voicePreset: VoicePreset;
  customVoice?: CustomVoiceProfile;
  savedArticleIds: string[];
  createdAt: string;
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
}

export interface StoryExplanation {
  headline: string;
  coreSummary: string;
  whyItMatters: string[];
  conversationalTakeaway: string;
  activePreset: VoicePreset;
  isCustomVoiced: boolean;
}

export interface EditionMetadata {
  volumeNumber: number;
  editionDate: string;
  formattedDate: string;
  generatedTimestamp: string;
  totalStories: number;
  isLiveFeed: boolean;
}
