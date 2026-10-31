import { ReaderProfile, TopicCategory, VoicePreset, CustomVoiceProfile, AgeRange } from '../types';

const PROFILES_STORAGE_KEY = 'curio_newspaper_profiles_v3';
const ACTIVE_PROFILE_ID_KEY = 'curio_active_profile_id_v3';
const ONBOARDING_COMPLETED_KEY = 'curio_onboarding_completed_v3';
const REDUCED_MOTION_KEY = 'curio_reduced_motion_v1';

export const DEFAULT_PROFILES: ReaderProfile[] = [
  {
    id: 'profile-aarav',
    name: 'Aarav Sharma',
    ageRange: '25-34',
    editionTitle: "Aarav Sharma's Newsroom",
    topics: ['economy', 'tech'],
    voicePreset: 'conversational',
    savedArticleIds: ['story-1', 'story-2'],
    readStoryIds: ['story-1'],
    likedStoryIds: ['story-2'],
    dislikedStoryIds: [],
    createdAt: '2026-10-28T06:00:00Z',
    hasCompletedWelcome: true,
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
    ageRange: '35-plus',
    editionTitle: "Priya Patel's Newsroom",
    topics: ['policy', 'world', 'climate'],
    voicePreset: 'executive',
    savedArticleIds: ['story-3', 'story-7'],
    readStoryIds: [],
    likedStoryIds: ['story-3'],
    dislikedStoryIds: [],
    createdAt: '2026-10-28T06:00:00Z',
    hasCompletedWelcome: true,
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
        return DEFAULT_PROFILES;
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure new array fields are initialized and legacy titles migrated to "Newsroom"
        return parsed.map((p) => {
          let editionTitle = p.editionTitle || `${p.name}'s Newsroom`;
          if (editionTitle.includes('Daily Briefing')) {
            editionTitle = editionTitle.replace('Daily Briefing', 'Newsroom');
          } else if (editionTitle.includes('Daily Dispatch')) {
            editionTitle = editionTitle.replace('Daily Dispatch', 'Newsroom');
          }

          return {
            ...p,
            editionTitle,
            readStoryIds: p.readStoryIds || [],
            likedStoryIds: p.likedStoryIds || [],
            dislikedStoryIds: p.dislikedStoryIds || [],
            savedArticleIds: p.savedArticleIds || [],
          };
        });
      }
      return DEFAULT_PROFILES;
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

  hasCompletedOnboarding(): boolean {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
  },

  setCompletedOnboarding(val: boolean): void {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, val ? 'true' : 'false');
  },

  getActiveProfileId(): string {
    return localStorage.getItem(ACTIVE_PROFILE_ID_KEY) || DEFAULT_PROFILES[0].id;
  },

  setActiveProfileId(id: string): void {
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
  },

  getReducedMotion(): boolean {
    return localStorage.getItem(REDUCED_MOTION_KEY) === 'true';
  },

  setReducedMotion(val: boolean): void {
    localStorage.setItem(REDUCED_MOTION_KEY, val ? 'true' : 'false');
  },

  updateProfile(updated: ReaderProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex((p) => p.id === updated.id);
    if (index !== -1) {
      profiles[index] = updated;
      this.saveProfiles(profiles);
    }
  },

  createProfile(
    name: string,
    ageRange: AgeRange,
    topics: TopicCategory[],
    voicePreset: VoicePreset,
    customTitle?: string
  ): ReaderProfile {
    const id = `profile-${Date.now().toString(36)}`;
    const editionTitle = customTitle?.trim() || `${name}'s Newsroom`;
    const newProfile: ReaderProfile = {
      id,
      name,
      ageRange,
      editionTitle,
      topics,
      voicePreset,
      savedArticleIds: [],
      readStoryIds: [],
      likedStoryIds: [],
      dislikedStoryIds: [],
      createdAt: new Date().toISOString(),
      hasCompletedWelcome: true,
    };
    const profiles = this.getProfiles();
    profiles.push(newProfile);
    this.saveProfiles(profiles);
    this.setActiveProfileId(id);
    this.setCompletedOnboarding(true);
    return newProfile;
  },

  resetAllPreferences(): void {
    try {
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_PROFILE_ID_KEY);
      localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      localStorage.removeItem('curio_byok_api_key');
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  }
};
