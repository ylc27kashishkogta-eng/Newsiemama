import React, { createContext, useContext, useState, useEffect } from 'react';
import { ReaderProfile, TopicCategory, VoicePreset, CustomVoiceProfile } from '../types';
import { storageService } from '../services/storageService';

interface ProfileContextType {
  currentProfile: ReaderProfile;
  profiles: ReaderProfile[];
  switchProfile: (id: string) => void;
  updateTopics: (topics: TopicCategory[]) => void;
  setVoicePreset: (preset: VoicePreset) => void;
  saveCustomVoice: (custom: CustomVoiceProfile) => void;
  createNewProfile: (name: string, topics: TopicCategory[], preset: VoicePreset) => ReaderProfile;
  toggleSaveArticle: (articleId: string) => void;
  isArticleSaved: (articleId: string) => boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<ReaderProfile[]>(() => storageService.getProfiles());
  const [activeId, setActiveId] = useState<string>(() => storageService.getActiveProfileId());

  const currentProfile = profiles.find((p) => p.id === activeId) || profiles[0];

  useEffect(() => {
    storageService.setActiveProfileId(activeId);
  }, [activeId]);

  const switchProfile = (id: string) => {
    setActiveId(id);
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

  const saveCustomVoice = (customVoice: CustomVoiceProfile) => {
    const updated: ReaderProfile = { ...currentProfile, customVoice };
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    storageService.updateProfile(updated);
  };

  const createNewProfile = (name: string, topics: TopicCategory[], preset: VoicePreset): ReaderProfile => {
    const newProfile = storageService.createProfile(name, topics, preset);
    setProfiles(storageService.getProfiles());
    setActiveId(newProfile.id);
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

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles,
        switchProfile,
        updateTopics,
        setVoicePreset,
        saveCustomVoice,
        createNewProfile,
        toggleSaveArticle,
        isArticleSaved,
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
