import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReaderProfile, TopicCategory, VoicePreset, CustomVoiceProfile, AgeRange } from '../types';
import { storageService, DEFAULT_PROFILES } from '../services/storageService';

interface ProfileContextType {
  currentProfile: ReaderProfile;
  profiles: ReaderProfile[];
  hasCompletedOnboarding: boolean;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  switchProfile: (id: string) => void;
  updateTopics: (topics: TopicCategory[]) => void;
  setVoicePreset: (preset: VoicePreset) => void;
  updateAgeRange: (ageRange: AgeRange) => void;
  updateProfileDetails: (name: string, ageRange: AgeRange, voicePreset: VoicePreset, topics: TopicCategory[]) => void;
  saveCustomVoice: (custom: CustomVoiceProfile) => void;
  createNewProfile: (name: string, ageRange: AgeRange, topics: TopicCategory[], preset: VoicePreset) => ReaderProfile;
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  markArticleAsRead: (articleId: string) => void;
  isArticleRead: (articleId: string) => boolean;
  toggleStoryFeedback: (articleId: string, feedback: 'more' | 'less') => void;
  getStoryFeedback: (articleId: string) => 'more' | 'less' | null;
  completeOnboarding: () => void;
  resetToWelcome: () => void;
  resetAllPreferences: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ReaderProfile[]>(() => storageService.getProfiles());
  const [activeId, setActiveId] = useState<string>(() => storageService.getActiveProfileId());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() =>
    storageService.hasCompletedOnboarding()
  );
  const [reducedMotion, setReducedMotion] = useState<boolean>(() =>
    storageService.getReducedMotion()
  );

  const currentProfile = profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];

  useEffect(() => {
    storageService.setActiveProfileId(activeId);
  }, [activeId]);

  useEffect(() => {
    storageService.setReducedMotion(reducedMotion);
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  const switchProfile = (id: string) => {
    setActiveId(id);
    storageService.setActiveProfileId(id);
  };

  const updateTopics = (topics: TopicCategory[]) => {
    const updated: ReaderProfile = { ...currentProfile, topics };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const setVoicePreset = (voicePreset: VoicePreset) => {
    const updated: ReaderProfile = { ...currentProfile, voicePreset };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const updateAgeRange = (ageRange: AgeRange) => {
    const updated: ReaderProfile = { ...currentProfile, ageRange };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const updateProfileDetails = (
    name: string,
    ageRange: AgeRange,
    voicePreset: VoicePreset,
    topics: TopicCategory[]
  ) => {
    const editionTitle = `${name}'s Daily Briefing`;
    const updated: ReaderProfile = {
      ...currentProfile,
      name,
      ageRange,
      voicePreset,
      topics,
      editionTitle,
    };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const saveCustomVoice = (customVoice: CustomVoiceProfile) => {
    const updated: ReaderProfile = { ...currentProfile, customVoice };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const createNewProfile = (
    name: string,
    ageRange: AgeRange,
    topics: TopicCategory[],
    preset: VoicePreset
  ): ReaderProfile => {
    const newProfile = storageService.createProfile(name, ageRange, topics, preset);
    setProfiles(storageService.getProfiles());
    setActiveId(newProfile.id);
    setHasCompletedOnboarding(true);
    return newProfile;
  };

  const toggleSaveArticle = (articleId: string) => {
    const isSaved = (currentProfile.savedArticleIds || []).includes(articleId);
    const savedArticleIds = isSaved
      ? (currentProfile.savedArticleIds || []).filter((id) => id !== articleId)
      : [...(currentProfile.savedArticleIds || []), articleId];

    const updated: ReaderProfile = { ...currentProfile, savedArticleIds };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const isArticleSaved = (articleId: string) => {
    return (currentProfile.savedArticleIds || []).includes(articleId);
  };

  const markArticleAsRead = (articleId: string) => {
    const currentRead = currentProfile.readStoryIds || [];
    if (!currentRead.includes(articleId)) {
      const readStoryIds = [...currentRead, articleId];
      const updated: ReaderProfile = { ...currentProfile, readStoryIds };
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      storageService.updateProfile(updated);
    }
  };

  const isArticleRead = (articleId: string) => {
    return (currentProfile.readStoryIds || []).includes(articleId);
  };

  const toggleStoryFeedback = (articleId: string, feedback: 'more' | 'less') => {
    const currentLiked = currentProfile.likedStoryIds || [];
    const currentDisliked = currentProfile.dislikedStoryIds || [];

    let newLiked = [...currentLiked];
    let newDisliked = [...currentDisliked];

    if (feedback === 'more') {
      if (newLiked.includes(articleId)) {
        newLiked = newLiked.filter((id) => id !== articleId);
      } else {
        newLiked.push(articleId);
        newDisliked = newDisliked.filter((id) => id !== articleId);
      }
    } else {
      if (newDisliked.includes(articleId)) {
        newDisliked = newDisliked.filter((id) => id !== articleId);
      } else {
        newDisliked.push(articleId);
        newLiked = newLiked.filter((id) => id !== articleId);
      }
    }

    const updated: ReaderProfile = {
      ...currentProfile,
      likedStoryIds: newLiked,
      dislikedStoryIds: newDisliked,
    };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const getStoryFeedback = (articleId: string): 'more' | 'less' | null => {
    if ((currentProfile.likedStoryIds || []).includes(articleId)) return 'more';
    if ((currentProfile.dislikedStoryIds || []).includes(articleId)) return 'less';
    return null;
  };

  const completeOnboarding = () => {
    storageService.setCompletedOnboarding(true);
    setHasCompletedOnboarding(true);
  };

  const resetToWelcome = () => {
    storageService.setCompletedOnboarding(false);
    setHasCompletedOnboarding(false);
  };

  const resetAllPreferences = () => {
    storageService.resetAllPreferences();
    setProfiles(DEFAULT_PROFILES);
    setActiveId(DEFAULT_PROFILES[0].id);
    setHasCompletedOnboarding(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles,
        hasCompletedOnboarding,
        reducedMotion,
        toggleReducedMotion,
        switchProfile,
        updateTopics,
        setVoicePreset,
        updateAgeRange,
        updateProfileDetails,
        saveCustomVoice,
        createNewProfile,
        toggleSaveArticle,
        isArticleSaved,
        markArticleAsRead,
        isArticleRead,
        toggleStoryFeedback,
        getStoryFeedback,
        completeOnboarding,
        resetToWelcome,
        resetAllPreferences,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
