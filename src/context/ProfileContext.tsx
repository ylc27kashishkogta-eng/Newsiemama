import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReaderProfile, TopicCategory, VoicePreset, CustomVoiceProfile, AgeRange } from '../types';
import { storageService, DEFAULT_PROFILES } from '../services/storageService';

interface ProfileContextType {
  currentProfile: ReaderProfile;
  profiles: ReaderProfile[];
  hasCompletedOnboarding: boolean;
  switchProfile: (id: string) => void;
  updateTopics: (topics: TopicCategory[]) => void;
  setVoicePreset: (preset: VoicePreset) => void;
  updateAgeRange: (ageRange: AgeRange) => void;
  updateProfileDetails: (name: string, ageRange: AgeRange, voicePreset: VoicePreset, topics: TopicCategory[]) => void;
  saveCustomVoice: (custom: CustomVoiceProfile) => void;
  createNewProfile: (name: string, ageRange: AgeRange, topics: TopicCategory[], preset: VoicePreset) => ReaderProfile;
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
  completeOnboarding: () => void;
  resetToWelcome: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ReaderProfile[]>(() => storageService.getProfiles());
  const [activeId, setActiveId] = useState<string>(() => storageService.getActiveProfileId());
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() =>
    storageService.hasCompletedOnboarding()
  );

  const currentProfile = profiles.find((p) => p.id === activeId) || profiles[0] || DEFAULT_PROFILES[0];

  useEffect(() => {
    storageService.setActiveProfileId(activeId);
  }, [activeId]);

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
    const isSaved = currentProfile.savedArticleIds.includes(articleId);
    const savedArticleIds = isSaved
      ? currentProfile.savedArticleIds.filter((id) => id !== articleId)
      : [...currentProfile.savedArticleIds, articleId];

    const updated: ReaderProfile = { ...currentProfile, savedArticleIds };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const isArticleSaved = (articleId: string) => {
    return currentProfile.savedArticleIds.includes(articleId);
  };

  const completeOnboarding = () => {
    storageService.setCompletedOnboarding(true);
    setHasCompletedOnboarding(true);
  };

  const resetToWelcome = () => {
    storageService.setCompletedOnboarding(false);
    setHasCompletedOnboarding(false);
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles,
        hasCompletedOnboarding,
        switchProfile,
        updateTopics,
        setVoicePreset,
        updateAgeRange,
        updateProfileDetails,
        saveCustomVoice,
        createNewProfile,
        toggleSaveArticle,
        isArticleSaved,
        completeOnboarding,
        resetToWelcome,
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
