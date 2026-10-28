import { ReaderProfile, TopicCategory, VoicePreset, CustomVoiceProfile } from '../types';

const PROFILES_STORAGE_KEY = 'curio_newspaper_profiles_v1';
const ACTIVE_PROFILE_ID_KEY = 'curio_active_profile_id_v1';

export const DEFAULT_PROFILES: ReaderProfile[] = [
  {
    id: 'profile-aarav',
    name: 'Aarav Sharma',
    editionTitle: "Aarav's Daily Briefing",
    topics: ['economy', 'tech'],
    voicePreset: 'conversational',
    savedArticleIds: ['story-1', 'story-2'],
    createdAt: '2026-10-28T06:00:00Z',
    customVoice: {
      brevity: 'concise',
      formality: 'semi-formal',
      useAnalogies: true,
      bulletPreference: false,
      rawSample: 'I like clear takeaways with a quick analogy that explains the real-world impact. Keep it energetic and straightforward.',
      analyzedAt: '2026-10-28T06:05:00Z',
    }
  },
  {
    id: 'profile-priya',
    name: 'Priya Patel',
    editionTitle: "Priya's Daily Dispatch",
    topics: ['policy', 'world', 'climate'],
    voicePreset: 'executive',
    savedArticleIds: ['story-3', 'story-7'],
    createdAt: '2026-10-28T06:00:00Z',
    customVoice: {
      brevity: 'concise',
      formality: 'formal',
      useAnalogies: false,
      bulletPreference: true,
      rawSample: 'Provide executive summaries with clear bullet points. Highlight regulatory, economic, and geopolitical implications first.',
      analyzedAt: '2026-10-28T06:10:00Z',
    }
  }
];

export const storageService = {
  getProfiles(): ReaderProfile[] {
    try {
      const data = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (!data) {
        this.saveProfiles(DEFAULT_PROFILES);
        return DEFAULT_PROFILES;
      }
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROFILES;
    } catch {
      return DEFAULT_PROFILES;
    }
  },

  saveProfiles(profiles: ReaderProfile[]): void {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  getActiveProfileId(): string {
    return localStorage.getItem(ACTIVE_PROFILE_ID_KEY) || DEFAULT_PROFILES[0].id;
  },

  setActiveProfileId(id: string): void {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  },

  updateProfile(updated: ReaderProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      profiles[index] = updated;
      this.saveProfiles(profiles);
    }
  },

  createProfile(name: string, topics: TopicCategory[], voicePreset: VoicePreset): ReaderProfile {
    const id = `profile-${Date.now().toString(36)}`;
    const editionTitle = `${name}'s Daily Briefing`;
    const newProfile: ReaderProfile = {
      id,
      name,
      editionTitle,
      topics,
      voicePreset,
      savedArticleIds: [],
      createdAt: new Date().toISOString(),
    };
    const profiles = this.getProfiles();
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfileId(id);
    return newProfile;
  }
};
